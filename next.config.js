const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const withLessExcludeAntd = require("./next-less.config.js");
const lessToJS = require('less-vars-to-js');
const withPlugins = require('next-compose-plugins');
const { ANALYZE } = process.env;
const fs = require('fs');
const path = require('path');

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (ANALYZE) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: isServer ? 8888 : 8889,
        openAnalyzer: true
      }))
    }
    return config;
  }
};

module.exports = withPlugins(
  [
    [withLessExcludeAntd({
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
    })]
  ], nextConfig
);
