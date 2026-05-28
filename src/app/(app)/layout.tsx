import "../globals.css";

import { Footer } from "@/globals/Footer/Component";
import { Header } from "@/globals/Header/Component";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import React from "react";
import { getServerSideURL } from "@/utilities/getURL";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={"font-sans h-[100dvh]"} lang="en" suppressHydrationWarning>
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="flex h-full flex-col bg-background text-foreground">
        <Providers>
          <Header />
          <div className="min-h-0 flex-1">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: await mergeOpenGraph(),
  twitter: {
    card: "summary_large_image",
    creator: "@payloadcms",
  },
};
