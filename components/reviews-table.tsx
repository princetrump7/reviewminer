"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronDown, ChevronUp, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Review {
  id: string;
  review_title: string | null;
  review_body: string | null;
  rating: number | null;
  review_date: string | null;
  author: string | null;
  verified_purchase: boolean | null;
}

interface ReviewsTableProps {
  reviews: Review[];
  loading?: boolean;
  scanId: string;
}

export function ReviewsTable({ reviews, loading, scanId }: ReviewsTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch(`/api/export/${scanId}`);
      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reviewminer-${scanId.slice(0, 8)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: "CSV downloaded!" });
    } catch {
      toast({ title: "Export failed. Try again.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="mb-2 h-5 w-3/4" />
            <Skeleton className="mb-1 h-4 w-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center">
        <p className="text-muted-foreground">No reviews found for this product.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {reviews.length} reviews
        </p>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? "Exporting..." : "Download CSV"}
        </Button>
      </div>

      <div className="space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  {/* Star rating */}
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < (review.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  {review.verified_purchase && (
                    <Badge variant="secondary" className="text-[10px]">
                      Verified
                    </Badge>
                  )}
                </div>
                <h4 className="font-medium">
                  {review.review_title || "Untitled Review"}
                </h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  {review.review_body && review.review_body.length > 200 ? (
                    <>
                      {expandedId === review.id
                        ? review.review_body
                        : `${review.review_body.slice(0, 200)}...`}
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === review.id ? null : review.id
                          )
                        }
                        className="ml-1 inline-flex items-center text-xs text-primary hover:underline"
                      >
                        {expandedId === review.id ? (
                          <>Show less <ChevronUp className="ml-0.5 h-3 w-3" /></>
                        ) : (
                          <>Show more <ChevronDown className="ml-0.5 h-3 w-3" /></>
                        )}
                      </button>
                    </>
                  ) : (
                    review.review_body
                  )}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {review.author && `by ${review.author}`}
                  {review.review_date && ` · ${review.review_date}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
