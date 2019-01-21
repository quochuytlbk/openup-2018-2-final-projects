const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common.js');

const distPath = path.join(__dirname, 'dist');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: distPath,
    historyApiFallback: true,
    inline: true,

    host: 'localhost',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
        changeOrigin: true
      }
    }
  }
});
