"use client";

import { useSupabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UrlInput } from "@/components/url-input";

export default function NewScan() {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold">New Scan</h1>
        <p className="mb-8 text-muted-foreground">
          Paste any Amazon product URL to extract reviews to CSV.
        </p>
        <UrlInput />
      </div>
    </div>
  );
}
