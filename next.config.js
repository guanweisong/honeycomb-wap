const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const withLess = require('@zeit/next-less');
const withCss = require('@zeit/next-css');
const lessToJS = require('less-vars-to-js');
const withPlugins = require('next-compose-plugins');
const { ANALYZE } = process.env;
const fs = require('fs');
const path = require('path');

const cssConfig = {
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[name]__[local]___[hash:base64:5]",
  },
};

const lessConfig = {
  lessLoaderOptions:{
    javascriptEnabled: true,
    modifyVars: lessToJS(
      fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
    )
  }
};

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
}

module.exports = withPlugins(
  [
    // [withCss, cssConfig],
    [withLess, lessConfig],
  ], nextConfig
);