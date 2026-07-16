"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sparkles, ThumbsUp, ThumbsDown, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface SummaryData {
  sentiment_breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  top_complaints: string[];
  top_praises: string[];
  key_themes: string[];
  overall_score: string;
}

interface SummaryCardProps {
  scanId: string;
  summary: SummaryData | null;
  loading?: boolean;
  onGenerate: () => void;
}

export function SummaryCard({
  scanId,
  summary,
  loading,
  onGenerate,
}: SummaryCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="h-5 w-5 text-primary" />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Get an AI-powered breakdown of sentiment, top complaints, and top
            praises from these reviews.
          </p>
          <Button onClick={onGenerate} variant="outline" className="w-full">
            <Sparkles aria-hidden="true" className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="h-5 w-5 text-primary" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall */}
        <div>
          <p className="text-sm text-muted-foreground">Overall Sentiment</p>
          <p className="text-lg font-semibold">{summary.overall_score}</p>
        </div>

        {/* Breakdown */}
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Sentiment Breakdown</p>
          <div className="flex h-3 overflow-hidden rounded-full">
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${summary.sentiment_breakdown.positive}%` }}
            />
            <div
              className="bg-gray-400 transition-all"
              style={{ width: `${summary.sentiment_breakdown.neutral}%` }}
            />
            <div
              className="bg-red-500 transition-all"
              style={{ width: `${summary.sentiment_breakdown.negative}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{summary.sentiment_breakdown.positive}% positive</span>
            <span>{summary.sentiment_breakdown.neutral}% neutral</span>
            <span>{summary.sentiment_breakdown.negative}% negative</span>
          </div>
        </div>

        {/* Praises */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <ThumbsUp aria-hidden="true" className="h-4 w-4 text-green-500" />
            Top Praises
          </p>
          <ul className="space-y-1">
            {summary.top_praises.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Complaints */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <ThumbsDown aria-hidden="true" className="h-4 w-4 text-red-500" />
            Top Complaints
          </p>
          <ul className="space-y-1">
            {summary.top_complaints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Themes */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-blue-500" />
            Key Themes
          </p>
          <div className="flex flex-wrap gap-2">
            {summary.key_themes.map((t, i) => (
              <Badge key={i} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
