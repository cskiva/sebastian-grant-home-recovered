"use client";

import { SiteConfig } from "@/data/SiteConfig";

function InstagramIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

type FooterProps = {
  config: SiteConfig;
  postPath?: string;
  postNode?: unknown;
  basicView?: boolean;
};

export default function Footer({ config }: FooterProps) {
  const { userLinks, copyright } = config;
  if (!copyright) return null;

  const instagram = userLinks?.find((l) => l.label === "Instagram");
  const facebook = userLinks?.find((l) => l.label === "Facebook");

  return (
    <footer className="w-full border-t border-border bg-background py-3">
      <div className="flex flex-col items-center gap-2 px-6 sm:flex-row sm:justify-between">
        <p className="text-xs text-muted-foreground tracking-wide">{copyright}</p>
        <div className="flex items-center gap-5">
          {instagram && (
            <a
              href={instagram.url}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <InstagramIcon />
            </a>
          )}
          {facebook && (
            <a
              href={facebook.url}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              <FacebookIcon />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
