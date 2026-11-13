import type { NextConfig } from "next";

const rawApiUrl =
  process.env.BACKEND_INTERNAL_URL ||
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:4000" : "");

const normalizedApiUrl = rawApiUrl.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  transpilePackages: ["@permata/ui"],
  reactStrictMode: false,
  devIndicators: false,
  turbopack: {},
  async rewrites() {
    if (!normalizedApiUrl) {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${normalizedApiUrl}/api/v1/:path*`,
      },
      {
        source: "/api/docs",
        destination: `${normalizedApiUrl}/api/docs`,
      },
      {
        source: "/api/docs/:path*",
        destination: `${normalizedApiUrl}/api/docs/:path*`,
      },
      {
        source: "/api/docs.json",
        destination: `${normalizedApiUrl}/api/docs.json`,
      },
      {
        source: "/health",
        destination: `${normalizedApiUrl}/health`,
      },
    ];
  },
};

export default nextConfig;
