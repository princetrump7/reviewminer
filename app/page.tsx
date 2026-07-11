import { UrlInput } from "@/components/url-input";

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero */}
      <section className="mx-auto max-w-4xl py-20 text-center">
        <div className="mb-6 inline-flex items-center rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
          🚀 Used by 100+ Amazon sellers
        </div>
        <h1 className="mb-6 text-5xl font-bold tracking-tight">
          Extract Amazon Reviews
          <br />
          <span className="text-primary">to CSV in Seconds</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Stop reading reviews one by one. Paste a product URL, get every review
          in a clean CSV with an AI-powered summary of what customers really
          think.
        </p>

        {/* URL Input */}
        <div className="mx-auto max-w-2xl">
          <UrlInput />
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <span>✓ Free tier — 3 exports/mo</span>
          <span>✓ AI-powered summaries</span>
          <span>✓ CSV download</span>
          <span>✓ No credit card required</span>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl py-16">
        <h2 className="mb-12 text-center text-3xl font-bold">
          How it works
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Paste URL",
              desc: "Copy any Amazon product page URL and paste it in.",
            },
            {
              step: "2",
              title: "We scrape reviews",
              desc: "We extract every review — title, body, rating, date, author.",
            },
            {
              step: "3",
              title: "Export CSV + AI summary",
              desc: "Download a clean CSV or get instant AI insights.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {item.step}
              </div>
              <h3 className="mb-2 font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section className="mx-auto max-w-4xl py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">Pricing</h2>
        <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
          <div className="rounded-xl border p-6">
            <h3 className="mb-2 text-xl font-bold">Free</h3>
            <p className="mb-4 text-3xl font-bold">$0</p>
            <ul className="mb-6 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> 3 exports per month
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> CSV download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> AI summary
              </li>
            </ul>
            <a
              href="/dashboard"
              className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </a>
          </div>
          <div className="rounded-xl border-2 border-primary p-6">
            <div className="mb-2 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Popular
            </div>
            <h3 className="mb-2 text-xl font-bold">Pro</h3>
            <p className="mb-4 text-3xl font-bold">$9</p>
            <p className="mb-6 text-sm text-muted-foreground">per month</p>
            <ul className="mb-6 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Unlimited exports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> CSV download
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> AI summary
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> Priority support
              </li>
            </ul>
            <a
              href="/dashboard"
              className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Subscribe
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
