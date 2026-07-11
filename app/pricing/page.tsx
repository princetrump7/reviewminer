"use client";

import { useSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "For casual research",
    features: [
      "3 exports per month",
      "CSV download",
      "AI-powered summary",
      "Up to 50 reviews per export",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious Amazon sellers",
    features: [
      "Unlimited exports",
      "CSV download",
      "AI-powered summary",
      "Unlimited reviews per export",
      "Priority support",
      "Early access to new features",
    ],
    cta: "Subscribe",
    highlighted: true,
  },
];

export default function Pricing() {
  const { session, supabase } = useSupabase();
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) {
        toast({ title: "Sign in failed", variant: "destructive" });
      }
      return;
    }

    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
      });
      const data = await res.json();

      if (data.url) {
        router.push(data.url);
      } else {
        toast({ title: "Failed to start checkout", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-muted-foreground">
          Start free. Upgrade when you need more exports.
        </p>
      </div>

      <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border p-8 ${
              plan.highlighted
                ? "border-2 border-primary shadow-lg"
                : "shadow"
            }`}
          >
            {plan.highlighted && (
              <div className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Most Popular
              </div>
            )}
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>

            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className="mt-8 w-full"
              variant={plan.highlighted ? "default" : "outline"}
              onClick={plan.name === "Pro" ? handleSubscribe : undefined}
              asChild={plan.name === "Free"}
            >
              {plan.name === "Free" ? (
                <a href="/dashboard">{plan.cta}</a>
              ) : (
                <span>{plan.cta}</span>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
