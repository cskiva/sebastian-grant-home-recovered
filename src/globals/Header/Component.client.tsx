"use client";

import type { Header, SiteSetting, User } from "@/payload-types";
import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { Logo } from "@/components/Logo/Logo";
import { cn } from "@/utilities/ui";
import { useHeaderTheme } from "@/providers/HeaderTheme";

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
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const attrs = mounted && headerTheme ? { "data-theme": headerTheme } : {};

  return (
    <header
      className={cn("container relative z-20 bg-red-100 w-full")}
      {...attrs}
      key={userData?.id}
    >
      <div className="py-2 flex justify-between">
        <Link href="/">
          <Logo
            loading="eager"
            priority="high"
            siteSettingsData={siteSettingsData}
          />
        </Link>
      </div>
    </header>
  );
};
