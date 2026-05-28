"use client";

import { Info, X } from "lucide-react";

import { camelCase } from "lodash";
import { DateTime } from "luxon";
import Footer from "../components/Footer/Footer";
import Layout from "../components/Layout";
import type { PostNode } from "../lib/posts";
import PostTags from "../components/PostTags/PostTags";
import config from "@/data/SiteConfig";
import { useState } from "react";

type PostTemplateProps = {
  postNode: PostNode;
  slug: string;
};

export default function PostTemplate({ postNode, slug }: PostTemplateProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  const post = postNode.frontmatter;
  const dateSource = postNode.fields.date || post.date || "";
  const dateFormatted = dateSource ? DateTime.fromISO(dateSource) : null;

  return (
    <Layout location="artworks" title={post.title || "Artwork"}>
      <div className="flex h-full flex-1 flex-col bg-background text-foreground">
        <div className="flex flex-1 flex-col lg:flex-row">
          <aside
            className={`fixed inset-x-0 top-[64px] z-40 h-[calc(100dvh-64px)] overflow-y-auto border-b border-border bg-background/95 px-5 py-6 backdrop-blur-sm transition-opacity duration-300 lg:static lg:h-auto lg:w-[350px] lg:border-b-0 lg:border-r lg:opacity-100 lg:backdrop-blur-none ${
              infoOpen
                ? "opacity-100"
                : "pointer-events-none opacity-0 lg:pointer-events-auto"
            }`}
          >
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {post.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  {dateFormatted?.isValid && (
                    <span className="rounded-full border border-border px-3 py-1">
                      {dateFormatted.year}
                    </span>
                  )}
                  {post.category && (
                    <span className="rounded-full border border-border px-3 py-1">
                      {post.category}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-foreground"
                dangerouslySetInnerHTML={{ __html: postNode.html }}
              />
              <PostTags tags={post.tags} />
            </div>
          </aside>

          <div className="relative flex-1">
            <iframe
              src={`/static.html?zoomify=${camelCase(slug)}`}
              title={post.title || "Artwork"}
              className="h-full min-h-[420px] w-full border-0"
              allow="fullscreen"
            />
            <div className="absolute bottom-5 left-1/2 w-[90%] -translate-x-1/2 rounded-full bg-black/40 px-4 py-2 text-center text-xs uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm lg:hidden">
              Tap info for details
            </div>
          </div>
        </div>

        <Footer config={config} postPath={`/art/${slug}`} postNode={postNode} />
      </div>

      <button
        type="button"
        className="fixed right-4 top-[90px] z-50 rounded-full border border-border bg-background px-3 py-3 shadow-md transition-all text-foreground lg:hidden"
        onClick={() => setInfoOpen((prev) => !prev)}
        aria-label="Toggle info"
      >
        {infoOpen ? <X size={24} /> : <Info size={24} />}
      </button>
    </Layout>
  );
}
