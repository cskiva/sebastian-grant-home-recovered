import redirects from "./redirects";
import { withPayload } from "@payloadcms/next/withPayload";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
        const url = new URL(item);
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(":", ""),
          port: url.port || undefined,
        };
      }),
    ],
  },
  reactStrictMode: true,
  redirects,
};

export default withPayload(nextConfig);
