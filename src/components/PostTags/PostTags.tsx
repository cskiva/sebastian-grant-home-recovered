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
      <h5 className="text-mediumGrey">
        <HashIcon />
      </h5>
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${_.kebabCase(tag)}`}
          className="rounded-xl border border-lightGrey bg-black/10 px-2 py-1 text-[0.75rem] font-bold text-mediumGrey shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.1)]"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
