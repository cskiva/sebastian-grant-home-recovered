import About from "@/components/About/About";
import Layout from "@/components/Layout";
import type { Metadata } from "next";
import config from "../../../../data/SiteConfig";

export const metadata: Metadata = {
  title: `About | ${config.siteTitle}`,
  description: config.siteDescription,
};

export default function AboutPage() {
  return (
    <Layout location="about" title="About">
      <div className="min-h-[calc(100vh-104px)] bg-white">
        <About />
      </div>
    </Layout>
  );
}
