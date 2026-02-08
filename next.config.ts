import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: ['lvh.me', '*.lvh.me', 'localhost', '*.localhost'],
  reactStrictMode: false,
};

export default nextConfig;
