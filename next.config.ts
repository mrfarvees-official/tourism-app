import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "lvh.me",
    "*.lvh.me",
    "localhost",
    "*.localhost",
    "lankatrails.com",
    "www.lankatrails.com",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
