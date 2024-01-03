const path = require('path');
const withNextIntl = require('next-intl/plugin')();
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['static.guanweisong.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error'],
          }
        : false,
  },
  poweredByHeader: false,
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.join(__dirname, './');
    return config;
  },
};

module.exports = withNextIntl(withPWA(nextConfig));
