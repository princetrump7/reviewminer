import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCsv } from "@/lib/csv";

export async function GET(
  _request: Request,
  { params }: { params: { scanId: string } }
) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { scanId } = params;

    // Get reviews for export
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("review_title, review_body, rating, review_date, author, verified_purchase")
      .eq("scan_id", scanId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error || !reviews) {
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    const csv = generateCsv(reviews);

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="reviewminer-${scanId.slice(0, 8)}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}
