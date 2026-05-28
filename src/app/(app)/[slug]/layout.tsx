import type { ReactNode } from "react";
import PageClient from "./page.client";

export default function SlugPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PageClient />
      {children}
    </div>
  );
}
