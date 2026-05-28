"use client";

import { EmailIcon, FacebookIcon } from "react-share";

import { SiteConfig } from "@/data/SiteConfig";

type UserLinksProps = {
  config: SiteConfig;
};

export default function UserLinks({ config }: UserLinksProps) {
  const { userLinks } = config;
  if (!userLinks) return null;

  const iconClass = "text-[22px] sm:text-[31px]";

  return (
    <div className="flex w-full items-center justify-end gap-4 pr-3 sm:pr-8">
      {userLinks.map((link) => (
        <a href={link.url} key={link.label} aria-label={link.label}>
          <span className="inline-flex items-center justify-center text-muted-foreground hover:text-foreground">
            {link.iconClassName === "fa fa-facebook" ? (
              <FacebookIcon className={iconClass} />
            ) : (
              <EmailIcon className={iconClass} />
            )}
          </span>
        </a>
      ))}
    </div>
  );
}
