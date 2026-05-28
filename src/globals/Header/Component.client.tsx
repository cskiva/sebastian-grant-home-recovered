"use client";

import type { Header, SiteSetting, User } from "@/payload-types";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/utilities/ui";
import { useHeaderTheme } from "@/providers/HeaderTheme";

const navItems = [
  { label: "About", href: "/art/about" },
  { label: "Artworks", href: "/art" },
  { label: "Music", href: "/art/music" },
  { label: "Software", href: "/art/software" },
  { label: "Outdoor", href: "/art/outdoor" },
];

interface HeaderClientProps {
  headerData: Header;
  siteSettingsData: SiteSetting;
  userData: User | null;
}

export const HeaderClient: React.FC<HeaderClientProps> = ({
  headerData,
  siteSettingsData,
  userData,
}) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme();
  const pathname = usePathname();
  const router = useRouter();

  // reset any page-specific override on route change
  useEffect(() => {
    setHeaderTheme(null); // 'inherit'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (userData?.id !== prevId.current) {
      prevId.current = userData?.id ?? null;
      router.refresh();
    }
  }, [userData?.id, router]);

  // avoid hydration mismatch: only apply data-theme on client
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const attrs = mounted && headerTheme ? { "data-theme": headerTheme } : {};

  if (pathname.includes("art")) return null;
  return (
    <>
      <header
        className={cn("w-full border-b border-border bg-background/95 backdrop-blur relative z-20")}
        {...attrs}
        key={userData?.id}
      >
        <div className="flex items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center">
            <Logo loading="eager" priority="high" siteSettingsData={siteSettingsData} />
          </Link>
          <nav className="hidden sm:flex flex-1 items-center justify-end">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="uppercase font-bold text-[0.9em] px-4 py-3 text-center transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            className="p-2 sm:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={36} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed left-0 right-0 top-0 z-50 bg-background shadow-lg">
          <div className="flex justify-end px-4 py-2">
            <button type="button" className="p-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={36} />
            </button>
          </div>
          <div className="flex flex-col px-4 pb-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="uppercase font-bold text-[0.9em] px-4 py-3 text-left transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
