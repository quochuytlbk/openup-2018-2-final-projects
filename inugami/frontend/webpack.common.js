const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const distPath = path.join(__dirname, 'dist');

module.exports = {
  entry: ['@babel/polyfill', './src/index.js'],
  output: {
    path: distPath,
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      favicon: './assets/images/favicon.png',
      filename: 'index.html',
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        collapseInlineTagWhitespace: true
      }
    }),
    new MiniCSSExtractPlugin({
      fileName: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          babelrc: true,
          cacheDirectory: true
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader?outputPath=./images',
        include: path.resolve(__dirname, 'assets/images')
      },
      {
        test: /\.(woff(2)?|ttf|eot)$/,
        loader: 'file-loader?outputPath=./fonts',
        include: path.resolve(__dirname, 'assets/fonts')
      },
      {
        test: /\.html$/,
        use: [{ loader: 'html-loader' }]
      },
      {
        test: /\.s?css$/,
        use: [MiniCSSExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader']
      }
    ]
  },

  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'assets'),
      Config: path.resolve(__dirname, 'src/app/config'),
      Enums: path.resolve(__dirname, 'src/app/enums')
    }
  }
};
