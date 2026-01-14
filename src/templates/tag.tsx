import type { PostEdge } from "../lib/posts";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing/PostListing";

type TagTemplateProps = {
  tag: string;
  postEdges: PostEdge[];
};

export default function TagTemplate({ tag, postEdges }: TagTemplateProps) {
  return (
    <Layout title={`Tags: ${tag}`} location="artworks">
      <div className="flex w-full flex-col items-center">
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
}
