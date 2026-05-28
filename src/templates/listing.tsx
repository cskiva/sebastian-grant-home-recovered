"use client";

import { List, ListEnd } from "lucide-react";

import { Button } from "@/components/ui/button";
import CategoryMenu from "@/components/CategoryMenu";
import Footer from "../components/Footer/Footer";
import Layout from "../components/Layout";
import Link from "next/link";
import type { PostEdge } from "../lib/posts";
import PostListing from "../components/PostListing/PostListing";
import config from "@/data/SiteConfig";
import { useState } from "react";

type ListingProps = {
  pageContext?: {
    currentPageNum: number;
    pageCount: number;
  };
  postEdges: PostEdge[];
};

export default function Listing({ pageContext, postEdges }: ListingProps) {
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const hasPosts = postEdges.length > 0;
  const buildArtPageHref = (pageNum: number) =>
    pageNum === 1 ? "/art" : `/art/${pageNum}`;

  const renderPaging = () => {
    if (!pageContext) return null;
    const { currentPageNum, pageCount } = pageContext;
    const prevPage = buildArtPageHref(currentPageNum - 1);
    const nextPage = buildArtPageHref(currentPageNum + 1);
    const isFirstPage = currentPageNum === 1;
    const isLastPage = currentPageNum === pageCount;

    if (pageCount <= 1) return null;

    return (
      <div className="mt-8 flex min-h-[88px] w-full items-center justify-center gap-2 border-t border-border bg-background px-4 py-4 sm:min-h-[110px]">
        {!isFirstPage && (
          <Link
            href={prevPage}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            PREV
          </Link>
        )}
        {Array.from({ length: pageCount }).map((_val, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPageNum;
          return (
            <Link
              key={`listing-page-${pageNum}`}
              href={buildArtPageHref(pageNum)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:bg-muted"
              }`}
            >
              {pageNum}
            </Link>
          );
        })}
        {!isLastPage && (
          <Link
            href={nextPage}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            NEXT
          </Link>
        )}
      </div>
    );
  };

  return (
    <Layout location="artworks" title="Artworks" postView={false}>
      <div className="flex">
        <Button
          type="button"
          className="hidden items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted md:mx-4 md:mt-2 md:flex"
          onClick={() => setSubMenuOpen((prev) => !prev)}
          aria-label="Toggle categories"
          variant={"ghost"}
        >
          {!subMenuOpen ? <List /> : <ListEnd />}
        </Button>
        {subMenuOpen && (
          <div className="w-full px-4 pb-2 md:w-[280px] md:pt-3">
            <CategoryMenu posts={postEdges} />
          </div>
        )}
        <div className="flex flex-1 flex-col bg-muted pt-4">
          <div className="flex w-full flex-col md:flex-row">
            <div className="flex-1 px-4 pb-8">
              {hasPosts ? (
                <div className="flex w-full flex-col items-center">
                  <PostListing postEdges={postEdges} />
                </div>
              ) : (
                <div className="mt-10 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-muted-foreground">
                  No artworks were found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {renderPaging()}
      <Footer config={config} basicView />
    </Layout>
  );
}
