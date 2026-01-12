import "./globals.css";

import { Footer } from "@/globals/Footer/Component";
import { Header } from "@/globals/Header/Component";
import { InitTheme } from "@/providers/Theme/InitTheme";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import React from "react";
import { draftMode } from "next/headers";
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
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body className="h-full flex flex-col bg-green-500">
        <Providers>
          <Header />
          <div className="flex-1 min-h-0 bg-blue-500">{children}</div>
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
