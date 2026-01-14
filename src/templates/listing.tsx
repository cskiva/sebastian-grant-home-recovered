"use client";

import Footer from "../components/Footer/Footer";
import Layout from "../components/Layout";
import Link from "next/link";
import { List } from "lucide-react";
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

  const renderPaging = () => {
    if (!pageContext) return null;
    const { currentPageNum, pageCount } = pageContext;
    const prevPage = currentPageNum - 1 === 1 ? "/" : `/${currentPageNum - 1}/`;
    const nextPage = `/${currentPageNum + 1}/`;
    const isFirstPage = currentPageNum === 1;
    const isLastPage = currentPageNum === pageCount;

    if (pageCount <= 1) return null;

    return (
      <div className="flex min-h-[88px] w-full items-center bg-gradient-to-b from-gray-500 to-darks-base py-3 sm:min-h-[130px]">
        {!isFirstPage && (
          <Link
            href={prevPage}
            className="mx-4 flex-1 rounded bg-darks-raised-r200 py-2 text-center text-white hover:bg-main"
          >
            PREV
          </Link>
        )}
        {Array.from({ length: pageCount }).map((_val, index) => {
          const pageNum = index + 1;
          return (
            <Link
              key={`listing-page-${pageNum}`}
              href={pageNum === 1 ? "/" : `/${pageNum}/`}
              className="mx-4 flex-1 rounded bg-darks-raised-r200 py-2 text-center text-white hover:bg-main"
            >
              {pageNum}
            </Link>
          );
        })}
        {!isLastPage && (
          <Link
            href={nextPage}
            className="mx-4 flex-1 rounded bg-darks-raised-r200 py-2 text-center text-white hover:bg-main"
          >
            NEXT
          </Link>
        )}
      </div>
    );
  };

  const categoryButtonClass =
    "mb-2 flex w-full items-center justify-center rounded-full border border-gray-400 bg-white px-3 py-2 text-[0.9rem] font-bold uppercase text-main-cadence transition-colors hover:bg-main-cadence hover:text-white";

  return (
    <Layout location="artworks" title="Artworks" postView={false}>
      <div className="flex flex-1 flex-col bg-[#fafafa] pt-4">
        <div className="flex w-full">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center text-black hover:bg-main hover:text-white md:flex"
            onClick={() => setSubMenuOpen((prev) => !prev)}
            aria-label="Toggle categories"
          >
            <List size={23} />
          </button>
          <div
            className={`hidden overflow-hidden bg-transparent transition-all duration-300 md:block ${
              subMenuOpen ? "w-56 px-8" : "w-0 px-0"
            }`}
          >
            <Link
              href="/categories/oil-painting"
              className={categoryButtonClass}
            >
              Oil Painting
            </Link>
            <Link href="/categories/drawing" className={categoryButtonClass}>
              Drawing
            </Link>
            <Link
              href="/categories/mixed-media"
              className={categoryButtonClass}
            >
              Other
            </Link>
          </div>
          <div className="flex-1 px-2 sm:px-4">
            <div className="flex w-full flex-col items-center">
              <PostListing postEdges={postEdges} />
            </div>
          </div>
        </div>
      </div>
      {renderPaging()}
      <Footer config={config} basicView />
    </Layout>
  );
}
