import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // Added to fix pdf library errors
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
  },
  // Added to fix pdf library errors
  serverExternalPackages: ['pdf-parse']

  /* config options here */
};

export default nextConfig;
