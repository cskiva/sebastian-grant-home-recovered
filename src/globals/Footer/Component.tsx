import { CMSLink } from "@/components/Link";
import { Logo } from "@/components/Logo/Logo";
import type { Footer, SiteSetting } from "@/payload-types";
import { ThemeSelector } from "@/providers/Theme/ThemeSelector";
import { getGlobal } from "@/utilities/getGlobals";
import Link from "next/link";

export async function Footer() {
  const footerData: Footer = await getGlobal("footer");
  const siteSettingsData: SiteSetting = await getGlobal("siteSettings", 1);

  const navItems = footerData?.navItems || [];

  if (siteSettingsData)
    return (
      <footer className="mt-auto border-t border-border bg-background text-foreground">
        <div className="container py-2 gap-2 flex flex-col md:flex-row md:justify-between">
          <Link className="flex items-center" href="/">
            <Logo siteSettingsData={siteSettingsData} />
          </Link>

          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            <ThemeSelector />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }, i) => {
                return <CMSLink className="text-foreground" key={i} {...link} />;
              })}
            </nav>
          </div>
        </div>
      </footer>
    );
}
