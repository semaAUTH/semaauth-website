import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  compress: true,
  output: "standalone",
  transpilePackages: ["@semaauth/sdk-web"],
};

export default nextConfig;
