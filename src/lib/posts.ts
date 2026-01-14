import _ from "lodash";
import config from "@/data/SiteConfig";
import fs from "fs";
import html from "remark-html";
import matter from "gray-matter";
import moment from "moment";
import path from "path";
import { remark } from "remark";

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

const postsDirectory = path.join(process.cwd(), "content");
const wordsPerMinute = 200;

const getMarkdownFiles = (dir: string): string[] => {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	return entries.flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			return getMarkdownFiles(fullPath);
		}
		if (entry.isFile() && /\.mdx?$/i.test(entry.name)) {
			return [fullPath];
		}
		return [];
	});
};

const normalizeCover = (cover?: string) => {
	if (!cover) return cover;
	if (/^(https?|ftp|file):\/\//i.test(cover)) return cover;
	return cover.replace(/^(\.\.\/)+/, "/");
};

const normalizeTags = (tags: unknown): string[] => {
	if (!tags) return [];
	if (Array.isArray(tags)) return tags.map((tag) => String(tag));
	return [String(tags)];
};

const buildSlug = (frontmatter: PostFrontmatter, relativePath: string) => {
	const parsed = path.parse(relativePath);
	const normalizedDir = parsed.dir.split(path.sep).join("/");
	let slug = "";

	if (frontmatter.title) {
		slug = `/${_.kebabCase(frontmatter.title)}`;
	} else if (parsed.name !== "index" && normalizedDir !== "") {
		slug = `/${normalizedDir}/${parsed.name}/`;
	} else if (normalizedDir === "") {
		slug = `/${parsed.name}/`;
	} else {
		slug = `/${normalizedDir}/`;
	}

	if (frontmatter.slug) {
		slug = `/${_.kebabCase(frontmatter.slug)}`;
	}

	if (!slug.endsWith("/")) slug += "/";

	return slug;
};

const buildDateField = (frontmatter: PostFrontmatter) => {
	if (!frontmatter.date) return null;
	const date = moment(frontmatter.date, config.dateFromFormat);
	if (date.isValid()) return date.toISOString();
	const fallback = new Date(frontmatter.date);
	return Number.isNaN(fallback.getTime()) ? null : fallback.toISOString();
};

const getExcerpt = (content: string) => {
	const words = content.replace(/\s+/g, " ").trim().split(" ");
	return words.slice(0, 30).join(" ");
};

const getTimeToRead = (content: string) => {
	const words = content.replace(/\s+/g, " ").trim().split(" ");
	return Math.max(1, Math.ceil(words.length / wordsPerMinute));
};

const buildPostNode = async (filePath: string): Promise<PostNode> => {
	const fileContents = fs.readFileSync(filePath, "utf8");
	const { data, content } = matter(fileContents);
	const frontmatter = data as PostFrontmatter;
	const relativePath = path.relative(postsDirectory, filePath);
	const slug = buildSlug(frontmatter, relativePath);
	const slugSegment = slug.replace(/^\/|\/$/g, "");
	const date = buildDateField(frontmatter);
	const processedContent = await remark().use(html).process(content);

	return {
		frontmatter: {
			...frontmatter,
			cover: normalizeCover(frontmatter.cover),
			tags: normalizeTags(frontmatter.tags),
		},
		fields: {
			slug,
			slugSegment,
			date,
		},
		excerpt: getExcerpt(content),
		timeToRead: getTimeToRead(content),
		html: processedContent.toString(),
	};
};

export const getAllPosts = async (): Promise<PostNode[]> => {
	if (!fs.existsSync(postsDirectory)) return [];
	const files = getMarkdownFiles(postsDirectory);
	return Promise.all(files.map((file) => buildPostNode(file)));
};

export const getPostsSortedByTitle = async (): Promise<PostNode[]> => {
	const posts = await getAllPosts();
	return posts.sort((a, b) =>
		(a.frontmatter.title || "").localeCompare(b.frontmatter.title || "")
	);
};

export const getPostsSortedByDateDesc = async (): Promise<PostNode[]> => {
	const posts = await getAllPosts();
	return posts.sort((a, b) => {
		const dateA = moment(a.frontmatter.date, config.dateFromFormat);
		const dateB = moment(b.frontmatter.date, config.dateFromFormat);
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
			tagMap.set(_.kebabCase(tag), tag);
		});
	});
	return tagMap;
};

export const getAllCategories = async (): Promise<Map<string, string>> => {
	const posts = await getAllPosts();
	const categoryMap = new Map<string, string>();
	posts.forEach((post) => {
		const category = post.frontmatter.category;
		if (category) categoryMap.set(_.kebabCase(category), category);
	});
	return categoryMap;
};
