import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['via.placeholder.com', 'res.cloudinary.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
};

export default nextConfig;
