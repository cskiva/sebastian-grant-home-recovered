import Layout from "@/components/Layout";
import type { Metadata } from "next";
import config from "@/data/SiteConfig";

export const metadata: Metadata = {
  title: `Software | ${config.siteTitle}`,
  description: config.siteDescription,
};

export default function SoftwarePage() {
  return (
    <Layout location="software" title={false}>
      <div className="min-h-[calc(100vh-104px)] px-4 py-6 text-black">
        <h3 className="text-lg font-semibold">Stone</h3>
        <p className="text-lg">Lead Designer at write In Stone</p>
      </div>
    </Layout>
  );
}
