import Listing from "@/templates/listing";
import type { Metadata } from "next";
import config from "@/data/SiteConfig";
import { getAllPosts } from "@/lib/posts";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

function normalizeCategory(input: string) {
  return decodeURIComponent(input).trim().toLowerCase();
}

function slugifyCategory(value: string) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-") // spaces -> hyphens, remove weird chars
    .replace(/^-+|-+$/g, ""); // trim hyphens
}

function postHasCategory(post: any, categoryParam: string) {
  const postCategory = post.frontmatter?.category ?? "";
  return slugifyCategory(postCategory) === slugifyCategory(categoryParam);
}

function buildCategoryMetadata(category: string): Metadata {
  const title = `${category} | ${config.siteTitle}`;
  const description = `Posts in category: ${category}`;
  const url = `${config.siteUrl}/art/categories/${encodeURIComponent(category)}`;
  const cover = new URL(config.siteLogo, config.siteUrl).toString();

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [cover],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cover],
    },
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;
  return buildCategoryMetadata(normalizeCategory(category));
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  const posts = await getAllPosts();
  const cat = decodeURIComponent(category).trim().toLowerCase();
  const filtered = posts.filter((p) => postHasCategory(p, cat));

  if (filtered.length === 0) notFound();

  const postEdges = filtered.map((node) => ({ node }));

  return <Listing postEdges={postEdges} />;
}
