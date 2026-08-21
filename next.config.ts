import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence the turbopack/webpack config warning
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      };
    }
    
    if (isServer) {
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas');
      }
    }

    return config;
  },
  serverExternalPackages: ['pdf-parse'],
};

export default nextConfig;
