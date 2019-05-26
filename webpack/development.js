import WebpackNotifierPlugin from 'webpack-notifier'

import Webpackbar from 'webpackbar'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import UnusedFilesWebpackPlugin from 'unused-files-webpack-plugin'

import appConfig from '../config/webpack'
import webpackConfig from './base'

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

webpackConfig.entry = [appConfig.compile.entry]

webpackConfig.plugins.push(
  new UnusedFilesWebpackPlugin({
    patterns: ['app/**/*.*'],
    globOptions: {
      ignore: [
        'app/static/**',
        'app/views/components/SvgIcons/**',
        'app/templates/**',
        'app/styles/vendor/**',
        'app/models/user/get-self/index.js'
      ]
    }
  }),
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false
  }),
  new Webpackbar()
)

webpackConfig.plugins.push(new WebpackNotifierPlugin({ alwaysNotify: false }))

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
