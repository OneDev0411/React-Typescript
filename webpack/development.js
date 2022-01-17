// @ts-nocheck
const path = require('path')

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const Webpackbar = require('webpackbar')

const common = require('./base')

const config = {
  mode: 'development',
  devtool: 'eval',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js',
    globalObject: 'self'
  },
  cache: { type: 'filesystem', allowCollectingMemory: true },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      cacheGroups: {
        default: {
          chunks: 'async',
          minSize: 30000,
          minChunks: 2,
          maxAsyncRequests: 5,
          maxInitialRequests: 3,
          priority: -20,
          reuseExistingChunk: true
        },
        vendors: {
          name: 'vendors',
          enforce: true,
          test(module) {
            return module.resource && module.resource.includes('node_modules')
          },
          priority: -10,
          reuseExistingChunk: true
        }
      }
    },
    removeAvailableModules: false,
    removeEmptyChunks: false,
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
    minimize: false
  },
  plugins: [
    new Webpackbar(),
    new webpack.HotModuleReplacementPlugin(),

    new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: 'whm'
      }
    })
  ]
}

module.exports = merge(common, config)
