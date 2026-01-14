import type { PostEdge } from "../lib/posts";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing/PostListing";

type LandingProps = {
  postEdges: PostEdge[];
};

export default function Landing({ postEdges }: LandingProps) {
  return (
    <Layout location="artworks" title="Artworks">
      <div className="flex w-full flex-col items-center">
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
}
