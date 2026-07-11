import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

// Dynamic to avoid prerendering issues with Supabase placeholder env vars
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ReviewMiner — Extract Amazon Reviews to CSV + AI Summary",
  description:
    "Paste an Amazon product URL and get all reviews extracted to CSV with an AI-powered summary. Free tier available.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center">
                <a href="/" className="mr-6 flex items-center space-x-2 font-bold">
                  <span className="text-primary">◆</span>
                  <span>ReviewMiner</span>
                </a>
                <nav className="flex flex-1 items-center space-x-4 text-sm text-muted-foreground">
                  <a href="/dashboard">Dashboard</a>
                  <a href="/pricing">Pricing</a>
                </nav>
                <div className="flex items-center space-x-2">
                  <a
                    href="/dashboard"
                    className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Sign In
                  </a>
                </div>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 text-center text-sm text-muted-foreground">
              <div className="container">
                ReviewMiner — Extract Amazon reviews to CSV in seconds.
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
