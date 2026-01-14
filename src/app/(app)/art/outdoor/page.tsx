import Layout from "@/components/Layout";
import type { Metadata } from "next";
import config from "@/data/SiteConfig";

export const metadata: Metadata = {
  title: `Outdoor | ${config.siteTitle}`,
  description: config.siteDescription,
};

export default function OutdoorPage() {
  return (
    <Layout location="outdoor" title={false}>
      <div className="min-h-[calc(100vh-104px)] px-4 py-6 text-black">
        <h3 className="text-lg font-semibold">33 Fruits Organics</h3>
        <p className="text-lg">Farmhand and Horticulture/Forestry</p>
      </div>
    </Layout>
  );
}
