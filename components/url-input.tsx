"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { useSupabase } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

export function UrlInput() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useSupabase();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!url.trim()) {
      toast({ title: "Please enter an Amazon product URL", variant: "destructive" });
      return;
    }

    // Basic URL validation
    if (!url.includes("amazon.") && !url.includes("amzn")) {
      toast({ title: "Please enter a valid Amazon product URL", variant: "destructive" });
      return;
    }

    if (!session) {
      // Redirect to sign in
      router.push("/dashboard");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to scrape reviews");
      }

      toast({ title: `Found ${data.total_reviews} reviews! Redirecting...` });
      router.push(`/dashboard/scan/${data.scan_id}`);
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Paste Amazon product URL (e.g., https://amazon.com/dp/B0XXXXX)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full rounded-md border border-input bg-background py-3 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          disabled={loading}
        />
      </div>
      <Button type="submit" disabled={loading} size="lg">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scraping...
          </>
        ) : (
          "Extract Reviews"
        )}
      </Button>
    </form>
  );
}
