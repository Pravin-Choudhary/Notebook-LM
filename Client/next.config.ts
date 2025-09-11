import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ["lh3.googleusercontent.com" , "avatars.githubusercontent.com"], // <-- add Google profile image host
  },
    eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
