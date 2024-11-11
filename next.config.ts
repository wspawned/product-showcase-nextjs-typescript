import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'n11scdn.akamaized.net',
      },
    ],
  },
};

export default nextConfig;
