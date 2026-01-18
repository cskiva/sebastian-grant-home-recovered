import { Button } from "../ui/button";
import { PostEdge } from "@/lib/posts";
import React from "react";

interface CategoryMenuProps {
  posts: PostEdge[];
}

// simple slugify helper
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function CategoryMenu({ posts }: CategoryMenuProps) {
  // Create a Set of unique categories
  const categories = React.useMemo(() => {
    return Array.from(
      new Set(
        posts.map((post) => post.node.frontmatter.category).filter(Boolean)
      )
    );
  }, [posts]);

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const slug = slugify(category ?? "");

        return (
          <Button
            key={slug}
            href={`/art/categories/${encodeURIComponent(slug)}`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted transition"
          >
            {category}
          </Button>
        );
      })}
    </div>
  );
}
