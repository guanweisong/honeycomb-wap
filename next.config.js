const path = require('path');
const withLess = require('next-with-less');
const withTM = require('next-transpile-modules')(['antd-mobile']);

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: false,
  // assetPrefix: isProd ? 'https://cdn.guanweisong.com' : '',
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
  experimental: {
    scrollRestoration: true,
    appDir: true,
  },
  // webpack: (config, options) => {
  //   config.resolve.alias['@'] = path.join(__dirname, './');
  //   return config;
  // },
};

module.exports = nextConfig;
