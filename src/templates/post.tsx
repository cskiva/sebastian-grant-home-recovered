"use client";

import { Info, X } from "lucide-react";
import { useEffect, useState } from "react";

import { DateTime } from "luxon";
import Footer from "../components/Footer/Footer";
import Layout from "../components/Layout";
import type { PostNode } from "../lib/posts";
import PostTags from "../components/PostTags/PostTags";
import _ from "lodash";
import config from "@/data/SiteConfig";

type PostTemplateProps = {
  postNode: PostNode;
  slug: string;
};

export default function PostTemplate({ postNode, slug }: PostTemplateProps) {
  const [infoOpen, setInfoOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const post = postNode.frontmatter;
  const dateFormatted = post.date ? DateTime.fromISO(post.date) : null;

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const { style } = document.body;
    const originalOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = originalOverflow;
    };
  }, []);

  const postPath = _.camelCase(slug);
  const pathPrefix = "/static.html?&zoomify=";
  const url = loaded ? `${pathPrefix}${postPath}` : "";

  return (
    <Layout location="artworks" title={post.title || ""} postView>
      <div className="flex h-full flex-1 flex-col">
        <div className="flex flex-1 flex-col">
          {!infoOpen && (
            <div className="sm:hidden">
              <div className="bg-perfectGrey border-y-[6px] border-black">
                <div className="px-4 py-4 text-black">
                  <h4 className="text-lg font-semibold">
                    <span>{post.title}</span>
                    {dateFormatted?.isValid && (
                      <span className="ml-2 text-base font-normal">
                        {dateFormatted.year}
                      </span>
                    )}
                  </h4>
                  <h5 className="italic">{post.category}</h5>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col sm:flex-row">
            <aside
              className={`fixed left-0 right-0 top-[52px] z-40 h-[101.3%] bg-white/90 backdrop-blur-sm transition-opacity sm:static sm:h-auto sm:w-[320px] sm:bg-transparent sm:opacity-100 sm:pointer-events-auto sm:backdrop-blur-0 ${
                infoOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <div className="h-full bg-perfectGrey border-y-[6px] border-black">
                <div className="px-4 py-4 text-black">
                  <h4 className="text-lg font-semibold">
                    <span>{post.title}</span>
                    {dateFormatted?.isValid && (
                      <span className="ml-2 text-base font-normal">
                        {dateFormatted.year}
                      </span>
                    )}
                  </h4>
                  <h5 className="italic">{post.category}</h5>
                  <p className="text-xs">
                    * Dates are in progress of being updated.
                  </p>
                </div>
                <div
                  className="px-4 pb-4 text-black [&_p]:text-black [&_h6]:text-black"
                  dangerouslySetInnerHTML={{ __html: postNode.html }}
                />
                <div className="px-4 pb-4">
                  <PostTags tags={post.tags} />
                </div>
              </div>
            </aside>

            <div className="relative flex-1">
              {loaded && (
                <iframe
                  title="zoomFrame"
                  src={url}
                  className="h-full w-full border-0 sm:rounded-md sm:shadow"
                  name={pathPrefix}
                  sandbox="allow-scripts allow-same-origin"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        </div>
        <Footer config={config} postPath={slug} postNode={postNode} />
      </div>

      <button
        type="button"
        className={`fixed top-[115px] -right-2 z-50 rounded-full border-2 px-3 py-3 shadow-md transition-all sm:hidden ${
          infoOpen
            ? "border-transparent bg-black text-white"
            : "border-black bg-perfectGrey text-black"
        }`}
        onClick={() => setInfoOpen((prev) => !prev)}
        aria-label="Toggle info"
      >
        {infoOpen ? <X size={30} /> : <Info size={30} />}
      </button>
    </Layout>
  );
}
