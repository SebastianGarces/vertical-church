import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vertical-church.t3.storage.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "registrations-production.s3.amazonaws.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
    ],
    localPatterns: [],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [48, 128, 256, 384],
    minimumCacheTTL: 2678400, // 31 days – most images are static and won't change
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
