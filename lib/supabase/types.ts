export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          export_count: number;
          stripe_customer_id: string | null;
          subscription_status: "free" | "pro";
          created_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          export_count?: number;
          stripe_customer_id?: string | null;
          subscription_status?: "free" | "pro";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          export_count?: number;
          stripe_customer_id?: string | null;
          subscription_status?: "free" | "pro";
          created_at?: string;
        };
      };
      scans: {
        Row: {
          id: string;
          user_id: string;
          asin: string;
          product_url: string;
          product_title: string | null;
          total_reviews: number;
          summary_json: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asin: string;
          product_url: string;
          product_title?: string | null;
          total_reviews?: number;
          summary_json?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          asin?: string;
          product_url?: string;
          product_title?: string | null;
          total_reviews?: number;
          summary_json?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          scan_id: string;
          user_id: string;
          review_title: string | null;
          review_body: string | null;
          rating: number | null;
          review_date: string | null;
          author: string | null;
          verified_purchase: boolean | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          scan_id: string;
          user_id: string;
          review_title?: string | null;
          review_body?: string | null;
          rating?: number | null;
          review_date?: string | null;
          author?: string | null;
          verified_purchase?: boolean | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          scan_id?: string;
          user_id?: string;
          review_title?: string | null;
          review_body?: string | null;
          rating?: number | null;
          review_date?: string | null;
          author?: string | null;
          verified_purchase?: boolean | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
