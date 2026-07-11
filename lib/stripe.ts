import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
  typescript: true,
});

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!;

export async function createCheckoutSession(
  customerId: string | null,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId || undefined,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({ email, limit: 1 });
  return customers.data[0] || null;
}
