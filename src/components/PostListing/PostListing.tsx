"use client";

import { DateTime } from "luxon";
import LazyImage from "../LazyLoad/LazyLoad";
import Link from "next/link";
import type { PostEdge } from "../../lib/posts";

type PostListingProps = {
  postEdges: PostEdge[];
};

export default function PostListing({ postEdges }: PostListingProps) {
  const postList = postEdges.map((postEdge) => ({
    path: postEdge.node.fields.slug,
    tags: postEdge.node.frontmatter.tags,
    cover: postEdge.node.frontmatter.cover,
    title: postEdge.node.frontmatter.title,
    category: postEdge.node.frontmatter.category,
    date: postEdge.node.fields.date
      ? DateTime.fromISO(postEdge.node.fields.date)
      : null,
  }));

  return (
    <div className="grid w-full grid-cols-2 gap-[2px] sm:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5">
      {postList.map((post) => (
        <Link
          href={`/art/${post.path}`}
          key={`/art/${post.path}`}
          className="group block"
        >
          <div className="bg-darks-raised-r100 transition-colors duration-300 group-hover:bg-darks-raised-r200">
            <div className="relative pb-[153%] sm:pb-[153%]">
              <LazyImage
                className="absolute inset-0 h-full w-full object-cover shadow-[0_3px_0_#000000] border-t border-[#808080]"
                src={post.cover || ""}
                alt={post.title || ""}
              />
            </div>
            <div className="hidden sm:block p-4 min-h-[150px] relative">
              <h4 className="title text-[1.2rem] text-main-cadence transition-colors duration-300 group-hover:text-main-rollover">
                {post.title}
              </h4>
              <p className="category text-[0.96rem] text-lightGrey">
                {post.category}
              </p>
              <div className="absolute bottom-0 right-1 px-4 pb-2 text-lightGrey font-thin">
                <h5 className="date text-[0.9rem]">{post.date?.year}</h5>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
