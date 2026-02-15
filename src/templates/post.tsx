"use client";

import { Info, X } from "lucide-react";

import { DateTime } from "luxon";
import Footer from "../components/Footer/Footer";
import Image from "next/image";
import Layout from "../components/Layout";
import type { PostNode } from "../lib/posts";
import PostTags from "../components/PostTags/PostTags";
import _ from "lodash";
import config from "@/data/SiteConfig";
import { useState } from "react";

type PostTemplateProps = {
  postNode: PostNode;
  slug: string;
};

export default function PostTemplate({ postNode, slug }: PostTemplateProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [viewerMode, setViewerMode] = useState<"zoomify" | "image">("zoomify");

  const post = postNode.frontmatter;
  const dateSource = postNode.fields.date || post.date || "";
  const dateFormatted = dateSource ? DateTime.fromISO(dateSource) : null;
  const cover = post.cover || "";
  const hasCover = Boolean(cover);
  const zoomifyKey = _.camelCase(post.slug);
  console.log(zoomifyKey);
  const zoomifySrc = `/static.html?zoomify=${encodeURIComponent(zoomifyKey)}`;

  return (
    <Layout location="artworks" title={post.title || "Artwork"}>
      <div className="flex h-full flex-1 flex-col bg-neutral-950 text-neutral-100">
        <div className="flex flex-1 flex-col lg:flex-row">
          <aside
            className={`fixed inset-x-0 top-[64px] z-40 h-[calc(100dvh-64px)] overflow-y-auto border-b border-neutral-700 bg-neutral-950/95 px-5 py-6 backdrop-blur-sm transition-opacity duration-300 lg:static lg:h-auto lg:w-[350px] lg:border-b-0 lg:border-r lg:opacity-100 lg:backdrop-blur-none ${
              infoOpen
                ? "opacity-100"
                : "pointer-events-none opacity-0 lg:pointer-events-auto"
            }`}
          >
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {post.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-neutral-300">
                  {dateFormatted?.isValid && (
                    <span className="rounded-full border border-neutral-700 px-3 py-1">
                      {dateFormatted.year}
                    </span>
                  )}
                  {post.category && (
                    <span className="rounded-full border border-neutral-700 px-3 py-1">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="prose prose-sm prose-invert max-w-none text-neutral-200"
                dangerouslySetInnerHTML={{ __html: postNode.html }}
              />
              <PostTags tags={post.tags} />
            </div>
          </aside>

          <div className="relative flex-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
            <div className="absolute right-4 top-4 z-20 flex gap-2">
              <button
                type="button"
                onClick={() => setViewerMode("zoomify")}
                className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${
                  viewerMode === "zoomify"
                    ? "border-cyan-200 bg-cyan-100 text-slate-900"
                    : "border-neutral-600 bg-black/30 text-cyan-100 hover:bg-black/45"
                }`}
              >
                Zoomify
              </button>
              {hasCover && (
                <button
                  type="button"
                  onClick={() => setViewerMode("image")}
                  className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${
                    viewerMode === "image"
                      ? "border-cyan-200 bg-cyan-100 text-slate-900"
                      : "border-neutral-600 bg-black/30 text-cyan-100 hover:bg-black/45"
                  }`}
                >
                  Image
                </button>
              )}
            </div>

            {viewerMode === "zoomify" ? (
              <iframe
                title={`${post.title || "Artwork"} zoom viewer`}
                src={zoomifySrc}
                className="h-full min-h-[420px] w-full border-0"
                name="zoomFrame"
                sandbox="allow-scripts allow-same-origin"
                allowFullScreen
                onError={() => {
                  if (hasCover) setViewerMode("image");
                }}
              />
            ) : hasCover ? (
              <div className="relative h-full min-h-[420px]">
                <Image
                  src={cover}
                  alt={post.title || "Artwork"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="object-contain p-4 sm:p-8 lg:p-10"
                  priority
                />
              </div>
            ) : (
              <div className="grid h-full min-h-[420px] place-items-center px-6 text-center text-neutral-400">
                <p className="rounded-2xl border border-dashed border-neutral-700 px-6 py-4">
                  Zoomify source is unavailable for this artwork.
                </p>
              </div>
            )}
            <div className="absolute bottom-5 left-1/2 w-[90%] -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-neutral-300 backdrop-blur-sm lg:hidden">
              Tap info for details
            </div>
          </div>
        </div>

        <Footer config={config} postPath={`/art/${slug}`} postNode={postNode} />
      </div>

      <button
        type="button"
        className={`fixed right-4 top-[90px] z-50 rounded-full border px-3 py-3 shadow-md transition-all lg:hidden ${
          infoOpen
            ? "border-neutral-800 bg-black text-white"
            : "border-neutral-300 bg-white text-black"
        }`}
        onClick={() => setInfoOpen((prev) => !prev)}
        aria-label="Toggle info"
      >
        {infoOpen ? <X size={24} /> : <Info size={24} />}
      </button>
    </Layout>
  );
}
