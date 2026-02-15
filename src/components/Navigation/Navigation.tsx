"use client";

import { Menu, X } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavigationProps = {
  location?: string;
  title?: string | false;
  postView?: boolean;
};

const navItems = [
  { label: "About", href: "/art/about", key: "about" },
  { label: "Artworks", href: "/art", key: "artworks" },
  { label: "Music", href: "/art/music", key: "music" },
  { label: "Software", href: "/art/software", key: "software" },
  { label: "Outdoor", href: "/art/outdoor", key: "outdoor" },
];

export default function Navigation({
  location,
  title,
  postView,
}: NavigationProps) {
  const [mobileMenuShow, setMobileMenuShow] = useState(false);

  const navButtonClass = (isActive: boolean) =>
    [
      "uppercase font-bold text-[0.9em] px-4 py-3 flex-1 text-center transition-colors",
      isActive
        ? "border-b-4 border-black pt-4"
        : "border-b-4 border-transparent",
      "hover:text-[#051629]",
    ].join(" ");

  const navLinks = (stacked = false) =>
    navItems.map((item) => (
      <Link
        key={item.key}
        href={item.href}
        className={`${navButtonClass(location === item.key)} ${
          stacked ? "text-left" : ""
        }`}
        onClick={() => stacked && setMobileMenuShow(false)}
      >
        {item.label}
      </Link>
    ));

  return (
    <>
      <div className="w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/logo-192.png"
              alt="Sebastian Grant"
              width={42}
              height={42}
              className="mr-2 rounded-full border border-neutral-300"
            />
            <h1 className="whitespace-nowrap text-[1.24em] font-bold text-black sm:text-[1.5em]">
              Sebastian Grant
            </h1>
          </Link>
          <div className="hidden flex-1 items-start justify-end sm:flex">
            {navLinks()}
          </div>
          <button
            type="button"
            className="p-2 sm:hidden"
            onClick={() => setMobileMenuShow(true)}
            aria-label="Open menu"
          >
            <Menu size={36} />
          </button>
        </div>
      </div>

      {mobileMenuShow && (
        <div className="fixed left-0 right-0 top-0 z-50 bg-white shadow-lg">
          <div className="flex justify-end px-4 py-2">
            <button
              type="button"
              className="p-2"
              onClick={() => setMobileMenuShow(false)}
              aria-label="Close menu"
            >
              <X size={36} />
            </button>
          </div>
          <div className="flex flex-col px-4 pb-4">{navLinks(true)}</div>
        </div>
      )}

      {!postView && title !== false && (
        <div className="hidden sm:block px-4 sm:px-6">
          <h3 className="py-2 text-lg font-medium text-neutral-900">{title}</h3>
        </div>
      )}
    </>
  );
}
