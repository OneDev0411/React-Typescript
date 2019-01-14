import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import S3Plugin from 'webpack-s3-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import fs from 'fs'
import Cdnizer from 'cdnizer'

import moment from 'moment'

import webpackConfig from './base'
import appConfig from '../config/webpack'

import path from 'path'

webpackConfig.mode = 'production'

class CdnizerPlugin {
  constructor() {
    this.cdnizer = null
  }

  apply = compiler => {
    compiler.hooks.afterEmit.tapAsync('Cdnizer', this.work)
  }

  work = async (compilation, callback) => {
    const { assets } = compilation
    const files = Object.keys(assets)
                  .map(file => {
                    return {
                      file: `{/,}*${file}*`
                    }
                  })

    this.cdnizer = Cdnizer({
      defaultCDNBase: process.env.ASSETS_BASEURL,
      files
    })

//     HtmlWebpackPlugin.getHooks(compilation).afterEmit.tap('Cdnizer', this.html)

    const regexp = /\.(html|css)$/

    const toBeCdnized = Object.values(assets)
                        .filter(asset => regexp.test(asset.existsAt))
                        .map(a => a.existsAt)

    const promises = toBeCdnized.map(path => this.cdnize(path))

    await Promise.all(promises)


    callback()
  }

  html = (data, callback) => {
    console.log('Got HTML', data)
    const cdnized = this.cdnizer(data)
    callback(null, cdnized)
  }

  cdnize = async path => {
    const text = await fs.promises.readFile(path, 'UTF-8')
    const cdnized = this.cdnizer(text)
    await fs.promises.writeFile(path, cdnized)
    console.log('Saved', path)
  }
}

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
//   new webpack.optimize.AggressiveMergingPlugin(),
  // reduce moment bundle size by removing unnecessary locales
//   new MomentLocalesPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].[hash].css"
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

  new CdnizerPlugin(),

  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.js$|\.css$/,
    filename: "[path]"
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
)

webpackConfig.module.rules.push({
  test: /\.(sa|sc|c)ss$/,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
//     'postcss-loader',
    'sass-loader',
  ],
})

export default webpackConfig
