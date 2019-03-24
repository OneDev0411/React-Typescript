import webpack from 'webpack'

import WebpackNotifierPlugin from 'webpack-notifier'

import Webpackbar from 'webpackbar'

import appConfig from '../config/webpack'
import webpackConfig from './base'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

webpackConfig.mode = 'development'

const postcss = function postcss() {
  return [
    require('postcss-cssnext')({
      features: {
        rem: false
      }
    }),
    require('postcss-browser-reporter')({}),
    require('postcss-reporter')({})
  ]
}

webpackConfig.entry = [
  'babel-polyfill',
  appConfig.compile.entry
]

webpackConfig.plugins.push(
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  }),
  new Webpackbar()
)

webpackConfig.plugins.push(new WebpackNotifierPlugin({ alwaysNotify: true }))

webpackConfig.module.rules.push(
  {
    test: /\.css/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcss
        }
      }
    ]
  },
  {
    test: /\.scss/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins: postcss
        }
      },
      'sass-loader'
    ]
  }
)

export default webpackConfig
