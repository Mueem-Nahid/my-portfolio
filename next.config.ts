import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local placeholder SVGs are authored by us; allow next/image to serve them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
