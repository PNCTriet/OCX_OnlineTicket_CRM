import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "scontent.fsgn10-1.fna.fbcdn.net",
      "api.qrserver.com",
      "img.vietqr.io",
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.otcayxe.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'scontent.fsgn7-2.fna.fbcdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude problematic modules from client-side build
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        'chrome-aws-lambda': false,
        'puppeteer-core': false,
        puppeteer: false,
      };
    }

    // Exclude source maps for problematic packages
    config.module.rules.push({
      test: /\.map$/,
      type: 'ignore',
    });

    return config;
  },
  serverExternalPackages: ['chrome-aws-lambda', 'puppeteer-core'],
};

export default nextConfig;

