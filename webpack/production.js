import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import webpackConfig from './base'
import appConfig from '../config/webpack'

function postcss() {
  return [
    require('autoprefixer')({
      browsers: ['> 1%', 'IE 10', 'Last 2 versions']
    })
  ]
}

webpackConfig.devtool = 'source-map'

webpackConfig.performance = {
  hints: 'warning',
  maxAssetSize: 200 * 1024,
  maxEntrypointSize: 300 * 1024
}

webpackConfig.entry = {
  app: ['babel-polyfill', appConfig.compile.entry],
  vendor: appConfig.compile.vendors
}

webpackConfig.plugins.push(
  new webpack.optimize.AggressiveMergingPlugin(),
  new Visualizer({
    filename: './statistics.html'
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: appConfig.compile.jsVendorBundle
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    parallel: true,
    cache: true,
    uglifyOptions: {
      output: { comments: false }
    }
  }),
  // reduce moment bundle size by removing unnecessary locales
  new MomentLocalesPlugin(),
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
        {
          loader: 'css-loader',
          options: { minimize: true }
        },
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
        {
          loader: 'css-loader',
          options: { minimize: true }
        },
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
