import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // AVIF first, WebP as fallback: smaller footer image for the same quality.
  images: { formats: ["image/avif", "image/webp"] },
  experimental: {
    // The Tailwind CSS is ~5 KB: inline it to drop the render-blocking stylesheet request on first visit.
    inlineCss: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
