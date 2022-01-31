// @ts-nocheck

const SentryCliPlugin = require('@sentry/webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const moment = require('moment')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const S3Plugin = require('webpack-s3-plugin')

const common = require('./base')

// const postcssOptions = {
//   plugins: [
//     require('postcss-preset-env')(),
//     require('postcss-browser-reporter')(),
//     require('postcss-reporter')()
//   ]
// }

const config = {
  mode: 'production',
  devtool: false,
  output: {
    pathinfo: false,
    publicPath: process.env.ASSETS_BASEURL,
    globalObject: 'self'
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          sourceMap: true
        },
        parallel: true,
        exclude: /grapesjs/
      })
    ]
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: 'sourcemaps/[name][hash].js.map'
    }),
    new MomentLocalesPlugin(),
    new CompressionPlugin({
      test: /\.(css|js)$/,
      filename: '[path][base]',
      deleteOriginalAssets: 'keep-source-map',
      threshold: 0, // S3 plugin expects all js assets to be gzipped
      minRatio: 1 // Therefore it adds a content-encoding to them all
    }),
    new SentryCliPlugin({
      release:
        process.env.CI_COMMIT_REF_SLUG || process.env.SOURCE_VERSION || '',
      include: 'dist/sourcemaps/',
      urlPrefix: `${process.env.ASSETS_BASEURL}sourcemaps/`
    }),
    new S3Plugin({
      progress: false, // Messes the terminal up
      exclude: /\.(html|map)$/,
      basePath: 'dist/',
      s3Options: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.ASSETS_REGION
      },
      s3UploadOptions: {
        Bucket: process.env.ASSETS_BUCKET,
        Expires: moment().utc().add('1', 'month').toDate(),
        ContentEncoding(fileName) {
          if (/\.(css|js)$/.test(fileName)) {
            return 'gzip'
          }
        },

        ContentType(fileName) {
          if (/\.js$/.test(fileName)) {
            return 'application/javascript'
          }

          if (/\.css$/.test(fileName)) {
            return 'text/css'
          }

          return 'text/plain'
        }
      },
      noCdnizer: true
    })
  ]
}

module.exports = merge(common, config)
