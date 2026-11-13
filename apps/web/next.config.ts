import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@permata/ui"],
  reactStrictMode: false,
  devIndicators: false,
  turbopack: {},
};

export default nextConfig;
