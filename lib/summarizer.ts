import Groq from "groq-sdk";

interface GroqSummary {
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

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function summarizeReviews(
  reviews: { review_title: string | null; review_body: string | null; rating: number | null }[]
): Promise<GroqSummary> {
  // Build a condensed text from reviews
  const reviewText = reviews
    .map(
      (r, i) =>
        `[${i + 1}] Rating: ${r.rating ?? "N/A"}\nTitle: ${r.review_title ?? "N/A"}\nBody: ${r.review_body ?? "N/A"}`
    )
    .join("\n\n");

  const prompt = `You are a product review analyst. Analyze the following Amazon customer reviews and return a JSON object (no markdown, no code fences) with these exact fields:

{
  "sentiment_breakdown": { "positive": number, "neutral": number, "negative": number },
  "top_complaints": string[] (up to 5),
  "top_praises": string[] (up to 5),
  "key_themes": string[] (up to 5),
  "overall_score": "a one-sentence overall assessment of the product"
}

sentiment_breakdown percentages must sum to 100. Base positive/negative/neutral on the rating (4-5 = positive, 3 = neutral, 1-2 = negative) AND the review body text.

Reviews:
${reviewText}

Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from Groq");
    }

    const parsed = JSON.parse(content) as GroqSummary;

    // Validate the structure
    if (
      typeof parsed.sentiment_breakdown?.positive !== "number" ||
      typeof parsed.sentiment_breakdown?.neutral !== "number" ||
      typeof parsed.sentiment_breakdown?.negative !== "number" ||
      !Array.isArray(parsed.top_complaints) ||
      !Array.isArray(parsed.top_praises) ||
      !Array.isArray(parsed.key_themes) ||
      typeof parsed.overall_score !== "string"
    ) {
      throw new Error("Invalid response structure from Groq");
    }

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse Groq response as JSON");
    }
    if (error instanceof Error && error.message.includes("rate_limit")) {
      throw new Error(
        "Groq API rate limit reached. Please wait a moment and try again."
      );
    }
    throw error;
  }
}
