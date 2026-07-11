import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { summarizeReviews } from "@/lib/summarizer";

export async function POST(request: Request) {
  try {
    const { scanId } = await request.json();

    if (!scanId) {
      return NextResponse.json({ error: "Scan ID is required" }, { status: 400 });
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // Get reviews for this scan
    const { data: reviews, error: reviewError } = await supabase
      .from("reviews")
      .select("review_title, review_body, rating")
      .eq("scan_id", scanId)
      .eq("user_id", user.id);

    if (reviewError || !reviews) {
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    if (reviews.length < 3) {
      return NextResponse.json(
        { error: "Need at least 3 reviews to generate a meaningful summary" },
        { status: 400 }
      );
    }

    // Generate summary via Groq
    const summary = await summarizeReviews(reviews);

    // Save summary to scan record
    const { error: updateError } = await supabase
      .from("scans")
      .update({ summary_json: summary as unknown as Record<string, unknown> })
      .eq("id", scanId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to save summary:", updateError);
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarize error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate summary";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
