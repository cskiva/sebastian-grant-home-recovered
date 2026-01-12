import { getCachedGlobal } from "@/utilities/getGlobals";
import Link from "next/link";
import type { Footer, SiteSetting } from "@/payload-types";
import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";

export async function Footer() {
  const footerData: Footer = await getCachedGlobal("footer", 1)();
  const siteSettingsData: SiteSetting = await getCachedGlobal(
    "siteSettings",
    1
  )();

  const navItems = footerData?.navItems || [];

  if (siteSettingsData)
    return (
      <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
        <div className="container py-2 gap-2 flex flex-col md:flex-row md:justify-between">
          <Link className="flex items-center" href="/">
            <Logo siteSettingsData={siteSettingsData} />
          </Link>

          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            <ThemeSelector />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-white" key={i} {...link} />;
              })}
            </nav>
          </div>
        </div>
      </footer>
    );
}
