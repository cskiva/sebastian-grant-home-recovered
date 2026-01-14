"use client";

import type { ReactNode } from "react";

import Navigation from "./Navigation/Navigation";

type LayoutProps = {
  children: ReactNode;
  location?: string;
  title?: string | false;
  postView?: boolean;
};

export default function Layout({
  children,
  location,
  title,
  postView,
}: LayoutProps) {
  return (
    <div
      className={`container-main min-h-[100svh] w-full flex flex-col ${
        postView ? "overflow-hidden" : "overflow-x-hidden"
      } text-lightGrey`}
    >
      <Navigation location={location} title={title} postView={postView} />
      {children}
    </div>
  );
}
