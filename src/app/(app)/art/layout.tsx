import "./globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import config from "../../../data/SiteConfig";

const siteUrl = new URL(config.siteUrl);
const logoUrl = new URL(config.siteLogo, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: config.siteTitle,
    template: `%s | ${config.siteTitle}`,
  },
  description: config.siteDescription,
  openGraph: {
    type: "website",
    url: config.siteUrl,
    title: config.siteTitle,
    description: config.siteDescription,
    siteName: config.siteTitle,
    images: [logoUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: config.siteTitle,
    description: config.siteDescription,
    images: [logoUrl],
    creator: config.userTwitter || undefined,
  },
  other: config.siteFBAppID ? { "fb:app_id": config.siteFBAppID } : undefined,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-lightGrey">{children}</body>
    </html>
  );
}
