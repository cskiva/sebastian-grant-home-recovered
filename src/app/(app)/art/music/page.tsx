import Layout from "@/components/Layout";
import { Metadata } from "next";
import config from "@/data/SiteConfig";

export const metadata: Metadata = {
  title: `Music | ${config.siteTitle}`,
  description: config.siteDescription,
};

const iframeClass =
  "w-full min-h-[calc(100vh-114px-6rem)] rounded-[20px] border border-border shadow-md";

export default function MusicPage() {
  return (
    <Layout location="music" title="Music">
      <div className="min-h-[calc(100vh-104px)] px-4 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center justify-center">
            <iframe
              title="NSSF"
              src="https://bandcamp.com/EmbeddedPlayer/album=2502642399/size=large/bgcol=333333/linkcol=0687f5/transparent=true/"
              className={iframeClass}
              seamless
            >
              <a href="https://tangentcouncil.bandcamp.com/album/north-star-south-flower">
                North Star South Flower by Tangent Council
              </a>
            </iframe>
          </div>
          <div className="flex items-center justify-center">
            <iframe
              title="Chrome"
              src="https://bandcamp.com/EmbeddedPlayer/album=1229072463/size=large/bgcol=333333/linkcol=0687f5/transparent=true/"
              className={iframeClass}
              seamless
            >
              <a href="https://tangentcouncil.bandcamp.com/album/crome">
                Crome by Tangent Council
              </a>
            </iframe>
          </div>
          <div className="flex items-center justify-center">
            <iframe
              title="Oars"
              src="https://bandcamp.com/EmbeddedPlayer/album=2780922782/size=large/bgcol=333333/linkcol=0687f5/transparent=true/"
              className={iframeClass}
              seamless
            >
              <a href="https://tangentcouncil.bandcamp.com/album/oars">
                oars by Tangent Council
              </a>
            </iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
}
