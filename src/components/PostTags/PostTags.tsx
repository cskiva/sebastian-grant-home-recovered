"use client";

import { HashIcon } from "lucide-react";
import Link from "next/link";
import _ from "lodash";

type PostTagsProps = {
  tags?: string[];
};

export default function PostTags({ tags }: PostTagsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <h5 className="text-muted-foreground">
        <HashIcon />
      </h5>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/art/tags/${_.kebabCase(tag)}`}
          className="rounded-xl border border-border bg-card px-2 py-1 text-[0.75rem] font-bold text-muted-foreground shadow-sm transition-colors hover:border-border hover:text-foreground"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
