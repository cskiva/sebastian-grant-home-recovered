"use client";

import type { PostNode } from "../../lib/posts";
import { Share } from "lucide-react";
import { SiteConfig } from "@/data/SiteConfig";
import SocialLinks from "../SocialLinks/SocialLinks";
import UserLinks from "../UserLinks/UserLinks";
import urljoin from "url-join";
import { useState } from "react";

type FooterProps = {
  config: SiteConfig;
  postPath?: string;
  postNode?: PostNode;
  basicView?: boolean;
};

export default function Footer({
  config,
  postPath,
  postNode,
  basicView,
}: FooterProps) {
  const post = !basicView && postNode?.frontmatter;
  const excerpt = !basicView && postNode?.excerpt;
  const [showShareMenu, setShowShareMenu] = useState(false);
  const url =
    !basicView && postPath
      ? urljoin(config.siteUrl, config.pathPrefix, postPath)
      : "";
  const { copyright } = config;

  if (!copyright) return null;

  return (
    <footer className="relative w-full bg-black py-1 text-mediumGrey sm:bg-transparent sm:py-2">
      {postNode && (
        <div
          className={`absolute left-5 -top-32 flex h-20 w-60 items-center justify-around rounded-full bg-white px-5 shadow-md transition-opacity duration-300 ${
            showShareMenu ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          {post && (
            <SocialLinks post={post} url={url} excerpt={excerpt as string} />
          )}
        </div>
      )}

      <div className="flex items-center justify-between px-4 sm:px-6">
        {postNode && (
          <div className="flex items-center">
            <button
              type="button"
              className="sm:hidden"
              onClick={() => setShowShareMenu((prev) => !prev)}
              aria-label="Toggle share menu"
            >
              <Share color="white" />
            </button>
            <div className="hidden sm:block">
              {post && (
                <SocialLinks
                  post={post}
                  url={url}
                  excerpt={excerpt as string}
                />
              )}
            </div>
          </div>
        )}

        <div className="flex-1 px-4">
          <p className="whitespace-nowrap text-[0.98em] text-lightGrey sm:text-main-cadence">
            <span className="hidden sm:inline">{copyright}</span>
            <span className="sm:hidden">© 2022 Sebastian Grant</span>
          </p>
        </div>

        <UserLinks config={config} />
      </div>
    </footer>
  );
}
