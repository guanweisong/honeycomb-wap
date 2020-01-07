const withLessExcludeAntd = require("./next-less.config.js");
const lessToJS = require('less-vars-to-js');
const withPlugins = require('next-compose-plugins');
const fs = require('fs');
const path = require('path');
const withBundleAnalyzer = require("@next/bundle-analyzer")({ enabled: process.env.ANALYZE === '1' });
const withSourceMaps = require('@zeit/next-source-maps')();

const nextConfig = {
  webpack: (config, options) => {
    config.resolve.alias["@"] = path.join(__dirname, "./");
    return config;
  }
};

module.exports = withPlugins([
  withSourceMaps,
  withLessExcludeAntd({
    cssModules: true,
    cssLoaderOptions: {
      importLoaders: 1,
      localIdentName: "[local]___[hash:base64:5]",
    },
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: lessToJS(
        fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
      )
    }
  }),
  withBundleAnalyzer,
], nextConfig);
