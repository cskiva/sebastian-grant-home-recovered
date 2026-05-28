import { getAllPosts, getPostsSortedByTitle } from "@/lib/posts";

import Listing from "@/templates/listing";
import type { Metadata } from "next";
import PostTemplate from "@/templates/post";
import config from "../../../../data/SiteConfig";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const buildPostMetadata = (
  post: Awaited<ReturnType<typeof getAllPosts>>[number]
): Metadata => {
  const title = post.frontmatter.title || config.siteTitle;
  const description =
    post.frontmatter.description || post.excerpt || config.siteDescription;
  const url = `${config.siteUrl}/art/${post.fields.slugSegment}`;
  const cover = post.frontmatter.cover
    ? new URL(post.frontmatter.cover, config.siteUrl).toString()
    : new URL(config.siteLogo, config.siteUrl).toString();

  return {
    title,
    description,
    openGraph: {
      type: "article",
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
};

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);

  const posts = await getAllPosts();
  const postMatch = posts.find((post) => post.fields.slugSegment === slug);

  if (postMatch) return buildPostMetadata(postMatch);

  return {
    title: config.siteTitle,
    description: config.siteDescription,
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug: encodedSlug } = await params;
  const slug = decodeURIComponent(encodedSlug);

  const posts = await getAllPosts();
  const postMatch = posts.find((post) => post.fields.slugSegment === slug);

  if (postMatch) {
    return (
      <PostTemplate postNode={postMatch} slug={postMatch.fields.slugSegment} />
    );
  }

  const postsPerPage = config.postsPerPage;
  const pageNumber = Number.parseInt(slug, 10);

  if (!postsPerPage || Number.isNaN(pageNumber) || pageNumber < 2) {
    notFound();
  }

  const sorted = await getPostsSortedByTitle();
  const pageCount = Math.ceil(sorted.length / postsPerPage);

  if (pageNumber > pageCount) {
    notFound();
  }

  const start = (pageNumber - 1) * postsPerPage;
  const postEdges = sorted
    .slice(start, start + postsPerPage)
    .map((node) => ({ node }));

  return (
    <Listing
      postEdges={postEdges}
      pageContext={{ currentPageNum: pageNumber, pageCount }}
    />
  );
}
