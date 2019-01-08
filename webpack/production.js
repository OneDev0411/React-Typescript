import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Visualizer from 'webpack-visualizer-plugin'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import ChangeExtensionPlugin from 'change-extension-plugin'
import S3Plugin from 'webpack-s3-plugin'

import moment from 'moment'

import webpackConfig from './base'
import appConfig from '../config/webpack'

const Expires = moment()
  .utc()
  .add('1', 'month')
  .toDate()

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
    filename: 'app/index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  }),
  new CompressionPlugin({
    asset: '[path].gz[query]',
    algorithm: 'gzip',
    test: /\.js$|\.css$/
  }),
  new ChangeExtensionPlugin({
    extensions: ['js']
  }),
  new S3Plugin({
    exclude: /.*\.html$/,
    basePath: 'dist',
    s3Options: {
      //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      //     region: 'us-west-1'
    },
    s3UploadOptions: {
      Bucket: process.env.ASSETS_BUCKET,
      Expires,
      ContentEncoding(fileName) {
        if (/\.gz/.test(fileName)) {
          return 'gzip'
        }
      },

      ContentType(fileName) {
        if (/\.js/.test(fileName)) {
          return 'application/javascript'
        }

        if (/\.css/.test(fileName)) {
          return 'text/css'
        }

        return 'text/plain'
      }
    },
    cdnizerOptions: {
      defaultCDNBase: process.env.ASSETS_BASEURL
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
