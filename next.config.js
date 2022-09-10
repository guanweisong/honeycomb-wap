const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // assetPrefix: isProd ? 'https://cdn.guanweisong.com' : '',
  webpack: (config, options) => {
    config.resolve.alias['@'] = path.join(__dirname, './');
    return config;
  },
};

module.exports = nextConfig;
