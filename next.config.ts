import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "evfcsjuazbrlnlbcogzb.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/events/**",
      },
    ],
  },
};

export default nextConfig;
