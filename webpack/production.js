import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import ImageminPlugin from 'imagemin-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
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

webpackConfig.devtool = ''

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
  new webpack.optimize.UglifyJsPlugin({
    minimize: true
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: appConfig.compile.jsVendorBundle
  }),
  new ExtractTextPlugin({
    filename: appConfig.compile.cssBundle,
    allChunks: true
  }),
  new ImageminPlugin({
    pngquant: {
      quality: '95-100'
    }
  }),
  new HtmlWebpackPlugin({
    template: appConfig.compile.template,
    hash: false,
    filename: 'app.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  }),
  new CopyWebpackPlugin([
    {
      from: path.join(appConfig.compile.entry, appConfig.compile.publicDirName),
      to: path.join(appConfig.compile.output, appConfig.compile.publicDirName),
    }
  ])
)

webpackConfig.module.rules.push(
  {
    test: /\.css/,
    use: ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: [
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
      fallbackLoader: 'style-loader',
      loader: [
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
