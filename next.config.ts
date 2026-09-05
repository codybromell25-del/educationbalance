import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Landing-page images uploaded via /admin/landing are served as
    // Supabase signed URLs. Without this allowlist, next/image throws
    // "hostname not configured" and the public homepage 500s the moment
    // the first image is uploaded. No `search` key on purpose — signed
    // URLs carry a ?token= query string that must be allowed through.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/**",
      },
    ],
  },
};

export default nextConfig;
