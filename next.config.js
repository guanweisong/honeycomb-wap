const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  reactStrictMode: false,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['honeycomb-1257715480.cos.ap-shanghai.myqcloud.com'],
  },
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.join(__dirname, './');
    return config;
  },
};

module.exports = nextConfig;
