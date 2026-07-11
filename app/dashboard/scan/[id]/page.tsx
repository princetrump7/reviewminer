"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewsTable } from "@/components/reviews-table";
import { SummaryCard } from "@/components/summary-card";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ScanData {
  id: string;
  asin: string;
  product_url: string;
  product_title: string | null;
  total_reviews: number;
  summary_json: Record<string, unknown> | null;
  created_at: string;
}

export default function ScanResults() {
  const params = useParams();
  const router = useRouter();
  const { session, supabase } = useSupabase();
  const [scan, setScan] = useState<ScanData | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push("/");
      return;
    }

    async function load() {
      const scanId = params.id as string;

      // Get scan
      const { data: scanData } = await supabase
        .from("scans")
        .select("*")
        .eq("id", scanId)
        .eq("user_id", session!.user.id)
        .single();

      if (!scanData) {
        toast({ title: "Scan not found", variant: "destructive" });
        router.push("/dashboard");
        return;
      }

      setScan(scanData);

      // Get reviews
      const { data: reviewsData } = await supabase
        .from("reviews")
        .select("*")
        .eq("scan_id", scanId)
        .order("created_at", { ascending: false });

      setReviews(reviewsData ?? []);
      setLoading(false);
    }

    load();
  }, [session, params.id, supabase, router]);

  async function handleGenerateSummary() {
    if (!scan) return;
    setSummarizing(true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scanId: scan.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      // Update local state with new summary
      setScan((prev) =>
        prev
          ? { ...prev, summary_json: data.summary as Record<string, unknown> }
          : prev
      );

      toast({ title: "Summary generated!" });
    } catch (err) {
      toast({
        title: err instanceof Error ? err.message : "Failed to generate summary",
        variant: "destructive",
      });
    } finally {
      setSummarizing(false);
    }
  }

  if (!session || !scan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  const summary = scan.summary_json as {
    sentiment_breakdown?: { positive: number; neutral: number; negative: number };
    top_complaints?: string[];
    top_praises?: string[];
    key_themes?: string[];
    overall_score?: string;
  } | null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Product info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {scan.product_title || scan.asin}
            {scan.product_url && (
              <a
                href={scan.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-normal text-primary hover:underline"
              >
                <ExternalLink className="inline h-3 w-3" />
                {" Amazon"}
              </a>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ASIN: </span>
              <span className="font-mono">{scan.asin}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Reviews: </span>
              <span>{scan.total_reviews}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Scanned: </span>
              <span>{new Date(scan.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reviews table */}
        <div className="lg:col-span-2">
          <ReviewsTable
            reviews={reviews}
            loading={loading}
            scanId={scan.id}
          />
        </div>

        {/* Summary */}
        <div>
          <SummaryCard
            scanId={scan.id}
            summary={summary as any}
            loading={summarizing}
            onGenerate={handleGenerateSummary}
          />
        </div>
      </div>
    </div>
  );
}
