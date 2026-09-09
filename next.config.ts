import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Atomic Tailwind CSS stays small — inlining removes the render-blocking
    // stylesheet request (faster FCP/LCP for first-time visitors).
    inlineCss: true,
  },
  images: {
    // Local placeholder SVGs are authored by us; allow next/image to serve them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
