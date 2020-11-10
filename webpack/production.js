import path from 'path'

import webpack from 'webpack'
import merge from 'webpack-merge'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import S3Plugin from 'webpack-s3-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'

import moment from 'moment'

import common from './base'

function postcss() {
  return [require('autoprefixer')()]
}

const config = {
  mode: 'production',
  devtool: false,
  output: {
    pathinfo: false,
    publicPath: process.env.ASSETS_BASEURL
  },
  performance: {
    hints: 'warning',
    maxAssetSize: 200 * 1024,
    maxEntrypointSize: 300 * 1024
  },
  entry: {
    app: [path.resolve(__dirname, '../app')],
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'moment',
      'lodash',
      'underscore',
      'offline-js'
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        exclude: /grapesjs/
      })
    ]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new MomentLocalesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new OptimizeCSSAssetsPlugin(),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$/,
      filename: '[path]'
    }),
    new ForkTsCheckerWebpackPlugin({
      /**
       * We want build to fail if there is a ts error
       */
      async: false,
      /**
       * react-scripts also sets this to true and the overhead is negligible
       * with respect to production build time
       */
      checkSyntacticErrors: true,
      useTypescriptIncrementalApi: true
    }),
    new S3Plugin({
      progress: false, // Messes the terminal up
      exclude: /.*\.html$/,
      basePath: 'dist/',
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-west-1'
      },
      s3UploadOptions: {
        Bucket: process.env.ASSETS_BUCKET,
        Expires: moment().utc().add('1', 'month').toDate(),
        ContentEncoding(fileName) {
          if (/\.js|.css/.test(fileName)) {
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
      noCdnizer: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
    ]
  }
}

export default merge(common, config)
