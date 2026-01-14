import type { PostEdge } from "../lib/posts";
import Layout from "../components/Layout";
import PostListing from "../components/PostListing/PostListing";

type CategoryTemplateProps = {
  category: string;
  postEdges: PostEdge[];
};

export default function CategoryTemplate({
  category,
  postEdges,
}: CategoryTemplateProps) {
  return (
    <Layout title={category} location="categories">
      <div className="flex w-full flex-col items-center">
        <PostListing postEdges={postEdges} />
      </div>
    </Layout>
  );
}
