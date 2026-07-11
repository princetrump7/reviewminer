import axios from "axios";
import * as cheerio from "cheerio";

export interface Review {
  review_title: string | null;
  review_body: string | null;
  rating: number | null;
  review_date: string | null;
  author: string | null;
  verified_purchase: boolean;
}

export interface ScrapeResult {
  reviews: Review[];
  total_reviews: number;
  product_title: string | null;
}

const AMAZON_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  DNT: "1",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
};

/**
 * Parse Amazon's review HTML using cheerio.
 * Amazon review page structure (as of 2024):
 *   - Each review is in a div[data-hook="review"]
 *   - Title: span[data-hook="review-title"]
 *   - Body: span[data-hook="review-body"] span
 *   - Rating: i[data-hook="review-star-rating"] span (contains "X out of 5 stars")
 *   - Date: span[data-hook="review-date"]
 *   - Author: span.a-profile-name (first inside review)
 *   - Verified: span[data-hook="avp-badge"] exists = verified
 */
function parseReviewHtml(html: string): Review[] {
  const $ = cheerio.load(html);
  const reviews: Review[] = [];

  $('div[data-hook="review"]').each((_, el) => {
    const reviewEl = $(el);

    // Title
    const titleEl = reviewEl.find('span[data-hook="review-title"]');
    // Amazon titles often have span > span > text, get all text
    const review_title = titleEl.text().trim() || null;

    // Body
    const bodyEl = reviewEl.find('span[data-hook="review-body"] span');
    const review_body = bodyEl.text().trim() || null;

    // Rating (e.g., "5 out of 5 stars")
    const ratingEl = reviewEl.find('i[data-hook="review-star-rating"] span');
    const ratingText = ratingEl.first().text().trim();
    const ratingMatch = ratingText.match(/(\d+)\s*out\s*of\s*5/i);
    const rating = ratingMatch ? parseInt(ratingMatch[1], 10) : null;

    // Date
    const dateEl = reviewEl.find('span[data-hook="review-date"]');
    const review_date = dateEl.text().trim() || null;

    // Author (first .a-profile-name within the review)
    const authorEl = reviewEl.find(".a-profile-name").first();
    const author = authorEl.text().trim() || null;

    // Verified purchase
    const verifiedEl = reviewEl.find('span[data-hook="avp-badge"]');
    const verified_purchase = verifiedEl.length > 0;

    // Only add if we have at least a title or body
    if (review_title || review_body) {
      reviews.push({
        review_title,
        review_body,
        rating,
        review_date,
        author,
        verified_purchase,
      });
    }
  });

  return reviews;
}

/**
 * Try to scrape Amazon reviews using a simple HTTP request.
 * This may get blocked by Amazon. If it fails, the Bright Data
 * scraper can be swapped in as a fallback.
 */
export async function scrapeAmazonReviews(
  asin: string
): Promise<ScrapeResult> {
  const allReviews: Review[] = [];
  let productTitle: string | null = null;
  let page = 1;
  const maxPages = 5; // ~50 reviews per scan (10 per page * 5)

  for (let page = 1; page <= maxPages; page++) {
    const url = `https://www.amazon.com/product-reviews/${asin}/ref=cm_cr_arp_d_paging_btm_next_${page}?pageNumber=${page}`;

    try {
      const response = await axios.get(url, {
        headers: AMAZON_HEADERS,
        timeout: 15000,
      });

      const html = response.data;
      const reviews = parseReviewHtml(html);

      if (reviews.length === 0) {
        break; // No more reviews
      }

      allReviews.push(...reviews);

      // Try to get product title from first page only
      if (page === 1) {
        const $ = cheerio.load(html);
        const titleEl = $(
          'a[data-hook="product-link"], .a-link-normal[href*="/dp/"]'
        ).first();
        productTitle = titleEl.text().trim() || null;

        // Fallback: try the page title
        if (!productTitle) {
          const pageTitle = $("title").text().trim();
          if (pageTitle) {
            productTitle = pageTitle.replace(
              /Amazon\.com:\w+:\s*|\s*-?\s*\d+ out of 5 stars.*$/i,
              ""
            ).trim() || null;
          }
        }
      }
    } catch (error) {
      // If we got results already, return them
      if (allReviews.length > 0) {
        break;
      }

      // If first page fails, propagate the error
      if (page === 1) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          if (status === 503 || status === 403) {
            throw new Error(
              "Amazon blocked this request. We need a more robust scraper. " +
                "Please try again later, or we can upgrade to our Pro scraper."
            );
          }
          throw new Error(
            `Failed to fetch reviews (HTTP ${status || error.message})`
          );
        }
        throw new Error("Failed to fetch reviews. Please try again.");
      }
      break;
    }
  }

  return {
    reviews: allReviews,
    total_reviews: allReviews.length,
    product_title: productTitle,
  };
}

/**
 * Placeholder for Bright Data scraper (drop-in replacement).
 * Unused until the simple HTTP approach fails consistently.
 */
export async function scrapeWithBrightData(
  asin: string
): Promise<ScrapeResult> {
  // TODO: Implement Bright Data Amazon Reviews scraper
  // Bright Data endpoint: https://api.brightdata.com/datasets/v3/trigger
  // Requires: dataset_id, API token
  // Returns: structured JSON (no HTML parsing needed)
  throw new Error("Bright Data scraper not yet configured.");
}
