import { PostEdge } from "@/lib/posts";
import Link from "next/link";
import React from "react";

interface CategoryMenuProps {
  posts: PostEdge[];
}

// simple slugify helper
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function CategoryMenu({ posts }: CategoryMenuProps) {
  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>();
    posts.forEach((post) => {
      const category = post.node.frontmatter.category?.trim();
      if (!category) return;
      const current = categoryMap.get(category) || 0;
      categoryMap.set(category, current + 1);
    });

    return Array.from(categoryMap.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
  }, [posts]);

  return (
    <div className="flex flex-wrap gap-2 md:flex-col">
      {categories.map(([category, count]) => {
        const slug = slugify(category);

        return (
          <Link
            key={slug}
            href={`/art/categories/${encodeURIComponent(slug)}`}
            className="inline-flex items-center justify-between rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 md:w-full"
          >
            <span>{category}</span>
            <span className="ml-2 rounded-full bg-neutral-900 px-2 py-0.5 text-xs text-white">
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
