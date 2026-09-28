import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root. A stray package-lock.json in the user profile
  // directory made Turbopack infer C:/Users/rsudh as the project root.
  turbopack: { root: __dirname },

  // Enable gzip / brotli compression on all responses
  compress: true,

  // Auto-serve AVIF then WebP for all next/image — massive byte savings
  images: {
    formats: ["image/avif", "image/webp"],
    // Reasonable cache TTL for optimised images
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // Aggressive cache headers for all static assets served from /_next/static
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts and images in /public aggressively
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        // Cache video files — large assets benefit most from long-lived cache
        source: "/:file(.*\\.mp4|.*\\.webm)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;