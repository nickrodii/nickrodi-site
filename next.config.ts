import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Serve the resume PDF at a clean /resume URL
      { source: "/resume", destination: "/resume.pdf" },
    ];
  },
};

export default nextConfig;
