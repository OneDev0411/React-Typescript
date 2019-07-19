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
    patterns: ['app/**/*.+(css|js|jsx|ts|tsx)'],
    globOptions: {
      ignore: [
        // Tests
        // Somehow, it seems the ts test files look unused here
        'app/**/*.test.+(js|jsx|ts|tsx)',

        // Our TS interface ONLY name convention
        // It somehow thinks they are unused when they only export interfaces :/
        'app/**/types.ts',

        // Static directory
        // This plugin thinks some CSS files there are unused but they aren't
        'app/static/**',

        // All icons
        // We got a lot of unused ones
        // TODO: Do something about icons and remove unused ones
        'app/views/components/SvgIcons/**',

        // Used in server directory which is out of webpack
        'app/models/user/get-self/index.js',

        // Mostly bootstrap and other 3rd party stuff
        // TODO: Get rid of these too if it's possible
        'app/styles/vendor/**',

        // Flows stuff
        // TODO: remove them from here when we enabled flows
        'app/models/flows/**',
        'app/views/components/AddToFlow/**',
        'app/components/Pages/Dashboard/Contacts/Profile/Flows/**',
        'app/components/Pages/Dashboard/Contacts/List/Filters/helpers/get-flows.js'
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
