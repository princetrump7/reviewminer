import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const supabaseId = session.metadata?.supabase_user_id;

      if (supabaseId && session.customer) {
        await supabase
          .from("profiles")
          .update({
            stripe_customer_id: session.customer as string,
            subscription_status: "pro",
          })
          .eq("id", supabaseId);
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      // Find the user by Stripe customer ID
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", subscription.customer as string);

      if (profiles && profiles.length > 0) {
        const status =
          subscription.status === "active" ||
          subscription.status === "trialing"
            ? "pro"
            : "free";

        await supabase
          .from("profiles")
          .update({ subscription_status: status })
          .in(
            "id",
            profiles.map((p) => p.id)
          );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
