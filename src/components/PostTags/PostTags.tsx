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
      <h5 className="text-neutral-400">
        <HashIcon />
      </h5>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/art/tags/${_.kebabCase(tag)}`}
          className="rounded-xl border border-neutral-700 bg-neutral-900/60 px-2 py-1 text-[0.75rem] font-bold text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_1px_1px_rgba(0,0,0,0.25)] transition-colors hover:border-neutral-500 hover:text-white"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
