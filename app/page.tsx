"use client";

import { useState } from "react";
import { UrlInput } from "@/components/url-input";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: "CSV Export",
    desc: "Download every review — title, body, rating, date, author — as a clean CSV file ready for analysis.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "AI Summary",
    desc: "Get an instant AI-powered summary of what customers love, hate, and request most. Sentiment analysis included.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "All Products",
    desc: "Works with any Amazon product across all marketplaces (.com, .co.uk, .de, .ca, and more).",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: "Secure & Private",
    desc: "Your data is encrypted in transit and at rest. We never store or share your review data with third parties.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Sentiment Trends",
    desc: "Track how customer sentiment changes over time. Spot emerging issues before they become problems.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="4 17 10 11 13 14 20 7" /><polyline points="14 7 20 7 20 13" />
      </svg>
    ),
    title: "Competitor Intel",
    desc: "Analyze competing products to find market gaps. See what customers wish your product had.",
  },
];

const testimonials = [
  { quote: "ReviewMiner saved me hours of manual copy-pasting. The AI summary alone is worth it.", name: "Sarah K.", role: "Amazon FBA Seller" },
  { quote: "I use it to monitor competitor reviews. The sentiment tracking helped me spot a packaging issue before it hit our brand.", name: "Marcus J.", role: "E-commerce Manager" },
  { quote: "Went from spending 3 hours a week on review analysis to 10 minutes. Game changer for product research.", name: "David L.", role: "Product Developer" },
];

const faqs = [
  { q: "Which Amazon marketplaces are supported?", a: "All major marketplaces including .com, .co.uk, .de, .fr, .it, .es, .ca, .jp, and .com.au. Just paste any product URL and we handle the rest." },
  { q: "How many reviews can I extract?", a: "Free tier allows 3 exports per month with up to 500 reviews each. Pro plan gives unlimited exports with up to 5,000 reviews per scan." },
  { q: "How accurate is the AI summary?", a: "The AI summary uses GPT-4o to analyze review content. It categorizes sentiments, extracts key themes, and identifies common complaints — typically within seconds of scraping." },
  { q: "Can I export to formats other than CSV?", a: "Currently we support CSV export. We're working on JSON, Excel, and Google Sheets integration — coming soon." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We never share or sell your data. Scans are automatically deleted after 90 days." },
  { q: "Can I cancel anytime?", a: "Absolutely. There's no lock-in contract. Cancel your subscription at any time and you'll retain access until the end of your billing period." },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="overflow-hidden rounded-xl border">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left font-medium transition-colors hover:bg-muted/50"
            aria-expanded={openIndex === i}
          >
            <span>{faq.q}</span>
            <svg
              viewBox="0 0 24 24"
              className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t px-5 py-4 text-sm text-muted-foreground">
              {faq.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* --- Hero --- */}
      <section className="relative isolate">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_50%_0%,hsl(var(--primary)/0.12),transparent)]" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" aria-hidden="true" />

        <div className="container mx-auto px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex animate-fade-in items-center gap-2 rounded-full border bg-background/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Trusted by 100+ Amazon sellers
            </div>

            <h1 className="animate-fade-in-up text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Extract Amazon Reviews
              <br />
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                to CSV in Seconds
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl animate-fade-in-up text-lg text-muted-foreground [animation-delay:150ms]">
              Stop reading reviews one by one. Paste a product URL, get every review
              in a clean CSV with an AI-powered summary of what customers really
              think.
            </p>

            {/* URL Input */}
            <div className="mx-auto mt-10 max-w-2xl animate-fade-in-up [animation-delay:300ms]">
              <UrlInput />
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex animate-fade-in-up flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground [animation-delay:450ms]">
              {["Free tier — 3 exports/mo", "AI-powered summaries", "CSV download", "No credit card required"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- How it Works --- */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">How it works</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Three clicks, unlimited insights</h2>
            <p className="mt-3 text-muted-foreground">
              From URL to actionable data in under 60 seconds.
            </p>
          </div>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {[
              { step: "01", title: "Paste a URL", desc: "Copy any Amazon product page URL and paste it into the input above.", color: "from-primary/20 to-primary/5" },
              { step: "02", title: "We scrape & analyze", desc: "Our engine extracts every review and runs it through AI for instant sentiment analysis.", color: "from-violet-500/20 to-violet-500/5" },
              { step: "03", title: "Export & act", desc: "Download a clean CSV or read the AI summary — then make data-driven product decisions.", color: "from-emerald-500/20 to-emerald-500/5" },
            ].map((item) => (
              <div key={item.step} className="group relative rounded-2xl border p-6 transition-all hover:shadow-md">
                <div className={`absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br ${item.color} opacity-0 transition-opacity group-hover:opacity-100`} aria-hidden="true" />
                <div className="mb-4 text-4xl font-black tracking-tighter text-primary/40">{item.step}</div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Features --- */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">Features</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to analyze reviews at scale</h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="group rounded-xl border bg-background p-6 transition-all hover:shadow-md">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials --- */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">Testimonials</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by sellers and product teams</h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border bg-background p-6">
                <div className="mb-4 flex gap-1" aria-label="5 stars">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} viewBox="0 0 24 24" className="h-4 w-4 fill-amber-400" aria-hidden="true">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed italic text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing --- */}
      <section id="pricing" className="border-t bg-gradient-to-b from-muted/30 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">Pricing</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-3 text-muted-foreground">Start free. Upgrade when you need more.</p>
          </div>
          <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="relative rounded-2xl border p-6 transition-all hover:shadow-md">
              <h3 className="mb-1 text-xl font-bold">Free</h3>
              <p className="mb-1 text-3xl font-bold">$0</p>
              <p className="mb-6 text-sm text-muted-foreground">forever</p>
              <ul className="mb-8 space-y-3 text-sm">
                {["3 exports per month", "Up to 500 reviews per scan", "CSV download", "AI-powered summary"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="flex h-10 w-full items-center justify-center rounded-lg border bg-background text-sm font-medium transition-colors hover:bg-muted"
              >
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-primary p-6 shadow-lg transition-all hover:shadow-xl">
              {/* Popular badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex rounded-full bg-gradient-to-r from-primary to-violet-500 px-4 py-1 text-xs font-semibold text-white shadow-sm">
                  Most Popular
                </span>
              </div>
              <h3 className="mb-1 text-xl font-bold">Pro</h3>
              <p className="mb-1 text-3xl font-bold">$9</p>
              <p className="mb-6 text-sm text-muted-foreground">per month</p>
              <ul className="mb-8 space-y-3 text-sm">
                {["Unlimited exports", "Up to 5,000 reviews per scan", "CSV download", "AI-powered summary", "Priority support"].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/dashboard"
                className="flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-primary to-violet-500 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
              >
                Subscribe
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="border-t py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">FAQ</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="border-t bg-gradient-to-r from-primary/5 via-primary/10 to-violet-500/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Ready to mine your first review?</h2>
          <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
            Paste an Amazon URL above or sign in to access your dashboard and scan history.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
            >
              Get Started Free
            </a>
            <a
              href="/pricing"
              className="inline-flex h-11 items-center justify-center rounded-lg border bg-background px-6 text-sm font-medium transition-colors hover:bg-muted"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out both; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in, .animate-fade-in-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
}
