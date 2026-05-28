import "server-only";

import type { Category, Media, Post } from "@/payload-types";

import { cache } from "react";
import config from "@/data/SiteConfig";
import configPromise from "@payload-config";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";
import { getMediaUrl } from "@/utilities/getMediaUrl";
import { getPayload } from "payload";
import moment from "moment";
import { toKebabCase } from "@/utilities/toKebabCase";

export type PostFrontmatter = {
  title?: string;
  date?: string;
  cover?: string;
  category?: string;
  tags?: string[];
  slug?: string;
  description?: string;
};

export type PostNode = {
  frontmatter: PostFrontmatter;
  fields: {
    slug: string;
    slugSegment: string;
    date: string | null;
  };
  excerpt: string;
  timeToRead: number;
  html: string;
};

export type PostEdge = { node: PostNode };

const wordsPerMinute = 200;

const isPopulatedMedia = (value: unknown): value is Media =>
  Boolean(value && typeof value === "object" && "url" in value);

const isPopulatedCategory = (value: unknown): value is Category =>
  Boolean(value && typeof value === "object" && "title" in value);

const getTextFromLexicalNode = (node: unknown): string => {
  if (!node || typeof node !== "object") return "";

  const maybeNode = node as {
    text?: unknown;
    children?: unknown;
  };

  const ownText = typeof maybeNode.text === "string" ? maybeNode.text : "";
  const childText = Array.isArray(maybeNode.children)
    ? maybeNode.children.map(getTextFromLexicalNode).join(" ")
    : "";

  return [ownText, childText].filter(Boolean).join(" ");
};

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const getExcerpt = (content: string) =>
  normalizeWhitespace(content).split(" ").slice(0, 30).join(" ");

const getTimeToRead = (content: string) => {
  const words = normalizeWhitespace(content).split(" ").filter(Boolean);
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
};

const normalizeTags = (tags: unknown): string[] => {
  if (!Array.isArray(tags)) return [];

  return tags
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "tag" in item) {
        return String((item as { tag?: unknown }).tag ?? "");
      }
      return "";
    })
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getPrimaryCategory = (post: Post) => {
  const category = post.categories?.find(isPopulatedCategory);
  return category?.title ?? undefined;
};

const getPrimaryImage = (post: Post) => {
  if (isPopulatedMedia(post.heroImage)) return post.heroImage;
  if (isPopulatedMedia(post.meta?.image)) return post.meta.image;
  return null;
};

const getCoverUrl = (post: Post) => {
  const media = getPrimaryImage(post);
  const url =
    media?.sizes?.large?.url ||
    media?.sizes?.medium?.url ||
    media?.sizes?.small?.url ||
    media?.url;

  return getMediaUrl(url, media?.updatedAt);
};

const getPublishedDate = (post: Post) => {
  const value = post.publishedAt || post.createdAt;
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const buildPostNode = (post: Post): PostNode => {
  const slugSegment = toKebabCase(post.slug);
  const date = getPublishedDate(post);
  const textContent = normalizeWhitespace(getTextFromLexicalNode(post.content?.root));
  const html = post.content
    ? convertLexicalToHTML({
        data: post.content as never,
        disableContainer: true,
      })
    : "";
  const tags = normalizeTags((post as Post & { tags?: unknown }).tags);
  const category = getPrimaryCategory(post);
  const cover = getCoverUrl(post);

  return {
    frontmatter: {
      title: post.title,
      date: date ?? undefined,
      cover,
      category,
      tags,
      slug: slugSegment,
      description: post.meta?.description || getExcerpt(textContent),
    },
    fields: {
      slug: `/${slugSegment}/`,
      slugSegment,
      date,
    },
    excerpt: getExcerpt(textContent),
    timeToRead: getTimeToRead(textContent),
    html,
  };
};

const queryPayloadPosts = cache(async (): Promise<Post[]> => {
  if (process.env.SKIP_BUILD_DB === "1") {
    return [];
  }

  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "posts",
    depth: 2,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    sort: "title",
  });

  return result.docs as Post[];
});

export const getAllPosts = async (): Promise<PostNode[]> => {
  const posts = await queryPayloadPosts();
  return posts.map(buildPostNode);
};

export const getPostsSortedByTitle = async (): Promise<PostNode[]> => {
  const posts = await getAllPosts();
  return posts.sort((a, b) =>
    (a.frontmatter.title || "").localeCompare(b.frontmatter.title || ""),
  );
};

export const getPostsSortedByDateDesc = async (): Promise<PostNode[]> => {
  const posts = await getAllPosts();
  return posts.sort((a, b) => {
    const dateA = moment(a.fields.date || a.frontmatter.date, config.dateFromFormat);
    const dateB = moment(b.fields.date || b.frontmatter.date, config.dateFromFormat);
    if (dateA.isBefore(dateB)) return 1;
    if (dateB.isBefore(dateA)) return -1;
    return 0;
  });
};

export const getAllTags = async (): Promise<Map<string, string>> => {
  const posts = await getAllPosts();
  const tagMap = new Map<string, string>();

  posts.forEach((post) => {
    post.frontmatter.tags?.forEach((tag) => {
      tagMap.set(toKebabCase(tag), tag);
    });
  });

  return tagMap;
};

export const getAllCategories = async (): Promise<Map<string, string>> => {
  const posts = await getAllPosts();
  const categoryMap = new Map<string, string>();

  posts.forEach((post) => {
    const category = post.frontmatter.category;
    if (category) categoryMap.set(toKebabCase(category), category);
  });

  return categoryMap;
};
