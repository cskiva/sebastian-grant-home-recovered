import { getAllPosts, getAllTags } from "@/lib/posts";

import type { Metadata } from "next";
import TagTemplate from "@/templates/tag";
import _ from "lodash";
import config from "@/data/SiteConfig";
import moment from "moment";

type PageProps = {
  params: Promise<{
    tag: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { tag: tagSlug } = await params;

  const tagMap = await getAllTags();
  const tag = tagMap.get(tagSlug) || _.startCase(tagSlug);

  return {
    title: `Posts tagged as "${tag}" | ${config.siteTitle}`,
    description: config.siteDescription,
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag: tagSlug } = await params;

  const posts = await getAllPosts();
  const tagMap = await getAllTags();
  const tag = tagMap.get(tagSlug) || _.startCase(tagSlug);

  const postEdges = posts
    .filter((post) => (post.frontmatter.tags || []).includes(tag)) // (see note below)
    .sort((a, b) => {
      const dateA = moment(a.frontmatter.date, config.dateFromFormat);
      const dateB = moment(b.frontmatter.date, config.dateFromFormat);
      if (dateA.isBefore(dateB)) return 1;
      if (dateB.isBefore(dateA)) return -1;
      return 0;
    })
    .map((node) => ({ node }));

  return <TagTemplate tag={tag} postEdges={postEdges} />;
}
