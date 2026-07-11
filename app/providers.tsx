"use client";

import { ThemeProvider } from "next-themes";
import { SessionContextProvider } from "@/lib/supabase/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SessionContextProvider>{children}</SessionContextProvider>
    </ThemeProvider>
  );
}
