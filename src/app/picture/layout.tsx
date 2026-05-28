import "../globals.css";

import Footer from "@/components/Footer/Footer";
import Navigation from "@/components/Navigation/Navigation";
import { ThemeProvider } from "next-themes";
import siteConfig from "@/data/SiteConfig";

export const metadata = {
  title: "Picture",
};

export default function PictureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="payload-theme">
          <Navigation />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer config={siteConfig} />
        </ThemeProvider>
      </body>
    </html>
  );
}
