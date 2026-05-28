import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    localPatterns: [
      {
        pathname: "/api/media/file/**",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default withPayload(nextConfig);
