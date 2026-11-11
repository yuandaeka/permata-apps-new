import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@permata/ui"],
  turbopack: {},
};

export default nextConfig;
