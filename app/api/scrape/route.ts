import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractAsin, isValidAmazonUrl } from "@/lib/asin";
import { scrapeAmazonReviews } from "@/lib/scraper";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isValidAmazonUrl(url)) {
      return NextResponse.json(
        { error: "Please provide a valid Amazon product URL" },
        { status: 400 }
      );
    }

    const asin = extractAsin(url);
    if (!asin) {
      return NextResponse.json(
        { error: "Could not extract product ID (ASIN) from URL" },
        { status: 400 }
      );
    }

    // Authenticate
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    // Check subscription for rate limiting
    const { data: profile } = await supabase
      .from("profiles")
      .select("export_count, subscription_status")
      .eq("id", user.id)
      .single();

    const isPro = profile?.subscription_status === "pro";
    const exportCount = profile?.export_count ?? 0;

    if (!isPro && exportCount >= 3) {
      return NextResponse.json(
        {
          error:
            "You've used all 3 free exports this month. Upgrade to Pro for unlimited exports.",
          upgradeRequired: true,
        },
        { status: 403 }
      );
    }

    // Scrape reviews
    const result = await scrapeAmazonReviews(asin);

    // Create scan record
    const { data: scan, error: scanError } = await supabase
      .from("scans")
      .insert({
        user_id: user.id,
        asin,
        product_url: url,
        product_title: result.product_title,
        total_reviews: result.total_reviews,
      })
      .select()
      .single();

    if (scanError || !scan) {
      throw new Error("Failed to save scan");
    }

    // Insert reviews in batch
    if (result.reviews.length > 0) {
      const reviewRows = result.reviews.map((r) => ({
        scan_id: scan.id,
        user_id: user.id,
        review_title: r.review_title,
        review_body: r.review_body,
        rating: r.rating,
        review_date: r.review_date,
        author: r.author,
        verified_purchase: r.verified_purchase,
      }));

      const { error: insertError } = await supabase
        .from("reviews")
        .insert(reviewRows);

      if (insertError) {
        // Clean up the scan if reviews failed
        await supabase.from("scans").delete().eq("id", scan.id);
        throw new Error("Failed to save reviews");
      }
    }

    // Increment export count
    await supabase
      .from("profiles")
      .update({ export_count: exportCount + 1 })
      .eq("id", user.id);

    return NextResponse.json({
      scan_id: scan.id,
      total_reviews: result.total_reviews,
      product_title: result.product_title,
    });
  } catch (error) {
    console.error("Scrape error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to scrape reviews";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
