"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, BarChart3, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Scan {
  id: string;
  asin: string;
  product_title: string | null;
  total_reviews: number;
  summary_json: Record<string, unknown> | null;
  created_at: string;
}

export default function Dashboard() {
  const { session, supabase } = useSupabase();
  const router = useRouter();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{
    export_count: number;
    subscription_status: string;
  } | null>(null);

  useEffect(() => {
    if (!session) {
      // Not authenticated — trigger sign in
      supabase.auth.signInWithOAuth({ provider: "google" });
      return;
    }

    async function load() {
      // Get profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("export_count, subscription_status")
        .eq("id", session!.user.id)
        .single();
      setProfile(prof);

      // Get scans
      const { data: scans } = await supabase
        .from("scans")
        .select("*")
        .eq("user_id", session!.user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      setScans(scans ?? []);
      setLoading(false);
    }

    load();
  }, [session, supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!session) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  const isPro = profile?.subscription_status === "pro";
  const remaining = isPro ? "Unlimited" : Math.max(0, 3 - (profile?.export_count ?? 0));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {session.user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => router.push("/dashboard/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exports Remaining</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{remaining}</p>
            <p className="text-xs text-muted-foreground">
              {isPro ? "Pro plan" : "Free tier — 3/month"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{scans.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">
              {isPro ? "Pro" : "Free"}
            </p>
            {!isPro && (
              <Button
                variant="link"
                className="h-auto p-0 text-xs"
                onClick={() => router.push("/pricing")}
              >
                Upgrade →
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Scan history */}
      <h2 className="mb-4 text-xl font-semibold">Scan History</h2>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : scans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <p className="mb-2 font-medium">No scans yet</p>
            <p className="mb-4 text-sm text-muted-foreground">
              Paste an Amazon URL to get started
            </p>
            <Button onClick={() => router.push("/dashboard/new")}>
              <Plus className="mr-2 h-4 w-4" />
              First Scan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => router.push(`/dashboard/scan/${scan.id}`)}
              className="w-full rounded-lg border p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {scan.product_title || scan.asin}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {scan.asin} · {scan.total_reviews} reviews
                    {scan.summary_json ? " · Summarized" : ""}
                  </p>
                </div>
                <p className="ml-4 shrink-0 text-xs text-muted-foreground">
                  {formatDate(scan.created_at)}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
