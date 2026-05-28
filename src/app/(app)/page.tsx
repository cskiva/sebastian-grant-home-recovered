import { getPostsSortedByDateDesc } from "@/lib/posts";
import { ArtGridPreview } from "@/components/ArtGridPreview";
import Link from "next/link";
import type { NextPage } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Page: NextPage = async () => {
  const posts = await getPostsSortedByDateDesc();
  const images = posts
    .filter((p) => p.frontmatter.cover)
    .map((p) => p.frontmatter.cover as string);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05060f] grid place-items-center">
      <ArtGridPreview images={images} />
      <Link
        href="/art"
        className="relative z-10 border border-white/20 bg-black/30 text-white/70 backdrop-blur-sm hover:bg-white/10 hover:text-white hover:border-white/40 tracking-[0.5em] uppercase text-xs font-light px-10 py-4 transition-all duration-300"
      >
        Art
      </Link>
    </main>
  );
};

export default Page;
