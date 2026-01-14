import { getPostsSortedByDateDesc, getPostsSortedByTitle } from "@/lib/posts";

import Landing from "@/templates/landing";
import Listing from "@/templates/listing";
import config from "../../../data/SiteConfig";

export default async function HomePage() {
  const postsPerPage = config.postsPerPage;

  if (!postsPerPage) {
    const posts = await getPostsSortedByDateDesc();
    return <Landing postEdges={posts.map((node) => ({ node }))} />;
  }

  const posts = await getPostsSortedByTitle();
  const pageCount = Math.ceil(posts.length / postsPerPage);
  const postEdges = posts.slice(0, postsPerPage).map((node) => ({ node }));

  if (!posts.length) {
    return <div>posts not found</div>;
  }
  return (
    <Listing
      postEdges={postEdges}
      pageContext={{ currentPageNum: 1, pageCount }}
    />
  );
}
