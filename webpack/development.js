import webpack from 'webpack'
import webpackConfig from './base'
import appConfig from '../config/webpack'
import WebpackNotifierPlugin from 'webpack-notifier'
import Jarvis from 'webpack-jarvis'

const postcss = function postcss() {
  return [
    require('postcss-cssnext')({}),
    require('postcss-browser-reporter')({}),
    require('postcss-reporter')({})
  ]
}

webpackConfig.entry = [
  'babel-polyfill',
  'react-hot-loader/patch',
  'webpack-hot-middleware/client',
  appConfig.compile.entry
]

webpackConfig.plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new Jarvis({
    port: 1337 // optional: set a port
  }),
  // new webpack.NoEmitOnErrorsPlugin(),
  new WebpackNotifierPlugin({ alwaysNotify: true })
)

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
