interface ReviewRow {
  review_title: string | null;
  review_body: string | null;
  rating: number | null;
  review_date: string | null;
  author: string | null;
  verified_purchase: boolean | null;
}

function escapeCsv(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // Escape quotes and wrap in quotes if contains comma, newline, or quote
  if (str.includes(",") || str.includes("\n") || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateCsv(reviews: ReviewRow[]): string {
  const headers = [
    "Title",
    "Body",
    "Rating",
    "Date",
    "Author",
    "Verified Purchase",
  ];

  const rows = reviews.map((r) =>
    [
      escapeCsv(r.review_title),
      escapeCsv(r.review_body),
      r.rating ?? "",
      escapeCsv(r.review_date),
      escapeCsv(r.author),
      r.verified_purchase ? "Yes" : "No",
    ].join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}
