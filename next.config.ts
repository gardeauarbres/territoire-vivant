import type { NextConfig } from "next";

// const withPWA = require("next-pwa")({
//   dest: "public",
//   disable: process.env.NODE_ENV === "development",
//   register: true,
//   skipWaiting: true,
// });

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Ensure we don't accidentally use static export if Vercel is confused
  output: undefined,
};

export default nextConfig; // withPWA(nextConfig);
