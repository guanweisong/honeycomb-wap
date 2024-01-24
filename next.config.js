const path = require('path');
const withNextIntl = require('next-intl/plugin')();
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.guanweisong.com',
        port: '',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 600,
  },
  compiler: {
    // removeConsole:
    //   process.env.NODE_ENV === 'production'
    //     ? {
    //         exclude: ['error'],
    //       }
    //     : false,
  },
  poweredByHeader: false,
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.join(__dirname, './');
    return config;
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
