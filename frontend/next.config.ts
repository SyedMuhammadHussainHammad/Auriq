import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placeholder.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    minimumCacheTTL: 86400,
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;