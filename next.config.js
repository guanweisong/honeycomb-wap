const path = require('path');
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
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
  async headers() {
    return [
      {
        //cache all images, fonts, etc. in the public folder
        //Note: Next.js default is 'public, max-age=0' which cases many reloads on Safari!
        //Note: we use version hashes and therefore can use immutable
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|mp4|ttf|otf|woff|woff2)',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  images: {
    domains: ['honeycomb-1257715480.cos.ap-shanghai.myqcloud.com'],
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

module.exports = withPWA(nextConfig);
