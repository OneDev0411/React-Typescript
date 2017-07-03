import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ImageminPlugin from 'imagemin-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpackConfig from './base'
import appConfig from '../config/webpack'

const postcss = function() {
  return [
    require('postcss-cssnext')({
      browsers: [
        'last 10 versions',
        '> 1%'
      ]
    })
  ]
}

webpackConfig.devtool = 'eval-source-map'

webpackConfig.performance = {
  hints: 'warning',
  maxAssetSize: 200 * 1024,
  maxEntrypointSize: 300 * 1024
}

webpackConfig.entry = {
  app: [
    'babel-polyfill',
    appConfig.compile.entry
  ],
  vendor: appConfig.compile.vendors
}

webpackConfig.plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: appConfig.compile.jsVendorBundle
  }),
  new webpack.optimize.UglifyJsPlugin({
    // Eliminate comments
    comments: true,
    // Compression specific options
    compress: {
      // remove warnings
      warnings: false,
      // Drop console statements
      drop_console: false,
      // remove debugger; statements
      drop_debugger: false
    }
  }),
  new ExtractTextPlugin({
    filename: appConfig.compile.cssBundle,
    allChunks: true
  }),
  new HtmlWebpackPlugin({
    template: appConfig.compile.template,
    hash: false,
    filename: 'app.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  })
)

webpackConfig.module.rules.push(
  {
    test: /\.css/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader' },
        {
          loader: 'postcss-loader',
          options: {
            plugins: postcss
          }
        }
      ]
    })
  },
  {
    test: /\.scss/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        { loader: 'css-loader' },
        {
          loader: 'postcss-loader',
          options: {
            plugins: postcss
          }
        },
        { loader: 'sass-loader' }
      ]
    })
  }
)

export default webpackConfig
