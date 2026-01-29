import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vertical-church.t3.storage.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
