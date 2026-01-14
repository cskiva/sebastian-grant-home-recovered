import About from "@/components/About/About";
import Layout from "@/components/Layout";
import type { Metadata } from "next";
import Script from "next/script";
import config from "@/data/SiteConfig";

export const metadata: Metadata = {
  title: `Zoomify | ${config.siteTitle}`,
  description: config.siteDescription,
};

export default function ZoomifyPage() {
  return (
    <Layout location="artworks" title="Zoomify Test">
      <Script
        src="/zoomify/ZoomifyImageViewerPro-min.js"
        strategy="afterInteractive"
      />
      <div className="bg-darks-raised-r100 px-4 py-6">
        <About />
        <div id="myZoomifyContainer" className="mt-4 border border-red-500" />
      </div>
    </Layout>
  );
}
