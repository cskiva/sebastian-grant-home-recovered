"use client";

import { DateTime } from "luxon";
import Image from "next/image";
import Link from "next/link";
import type { PostEdge } from "../../lib/posts";

type PostListingProps = {
  postEdges: PostEdge[];
};

export default function PostListing({ postEdges }: PostListingProps) {
  const postList = postEdges.map((postEdge) => ({
    slugSegment: postEdge.node.fields.slugSegment,
    tags: postEdge.node.frontmatter.tags,
    cover: postEdge.node.frontmatter.cover,
    title: postEdge.node.frontmatter.title,
    category: postEdge.node.frontmatter.category,
    date: postEdge.node.fields.date
      ? DateTime.fromISO(postEdge.node.fields.date)
      : null,
  }));

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {postList.map((post) => (
        <Link
          href={`/art/${encodeURIComponent(post.slugSegment)}`}
          key={post.slugSegment}
          className="group block overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-lg"
        >
          <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
            {post.cover ? (
              <Image
                src={post.cover}
                alt={post.title || "Artwork"}
                fill
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 24vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-100 text-xs uppercase tracking-[0.25em] text-neutral-500">
                Image pending
              </div>
            )}
          </div>
          <div className="space-y-1 p-4">
            <h4 className="line-clamp-1 text-base font-semibold text-neutral-900">
              {post.title}
            </h4>
            <p className="line-clamp-1 text-sm text-neutral-600">{post.category}</p>
            <div className="flex items-center justify-between pt-1 text-xs uppercase tracking-[0.12em] text-neutral-500">
              <span>{post.date?.isValid ? post.date.year : "Undated"}</span>
              <span>{post.tags?.length ?? 0} tags</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
