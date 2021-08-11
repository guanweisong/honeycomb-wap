const withPlugins = require('next-compose-plugins')
const fs = require('fs')
const path = require('path')
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  // assetPrefix: isProd ? 'https://cdn.guanweisong.com' : '',
  webpack: (config, options) => {
    config.resolve.alias["@"] = path.join(__dirname, "./")
    return config;
  }
};

module.exports = withPlugins([], nextConfig)
