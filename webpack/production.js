import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MomentLocalesPlugin from 'moment-locales-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'
import S3Plugin from 'webpack-s3-plugin'
import SentryCliPlugin from '@sentry/webpack-plugin'
import { ESBuildPlugin } from 'esbuild-loader'

import moment from 'moment'

import webpackConfig from './base'
import appConfig from '../config/webpack'

const ESBUILD_COMMON_OPTIONS = {
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  sourceMap: false
}

webpackConfig.mode = 'production'

webpackConfig.optimization = {
  splitChunks: {
    chunks: 'all'
  }
}

const Expires = moment().utc().add('1', 'month').toDate()

function postcss() {
  return [require('autoprefixer')()]
}

webpackConfig.devtool = false

webpackConfig.output.pathinfo = false
webpackConfig.output.publicPath = process.env.ASSETS_BASEURL

webpackConfig.performance = {
  hints: 'warning',
  maxAssetSize: 200 * 1024,
  maxEntrypointSize: 300 * 1024
}

webpackConfig.entry = {
  app: [appConfig.compile.entry],
  vendor: appConfig.compile.vendors
}

webpackConfig.plugins.push(
  new ESBuildPlugin(),
  new webpack.optimize.AggressiveMergingPlugin(),
  new MomentLocalesPlugin(),
  new HtmlWebpackPlugin({
    template: appConfig.compile.template,
    hash: false,
    filename: 'app/index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  })
)

// SOURCE_VERSION variable only exists in Heroku env
if (process.env.SOURCE_VERSION) {
  webpackConfig.plugins.push(
    new SentryCliPlugin({
      release: process.env.SOURCE_VERSION, // refers to the latest commit hash
      include: 'dist/',
      ignore: ['node_modules'],
      urlPrefix: process.env.ASSETS_BASEURL
    })
  )
}

webpackConfig.plugins.push(
  new CompressionPlugin({
    algorithm: 'gzip',
    test: /\.js$|\.css$/,
    filename: '[path]'
  }),
  new S3Plugin({
    progress: false, // Messes the terminal up
    exclude: [/.*\.html$/, /.*\.map$/],
    basePath: 'dist/',
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: 'us-west-1'
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

        if (/\.svg/.test(fileName)) {
          return 'image/svg+xml; charset=UTF-8'
        }

        return 'text/plain'
      }
    },
    noCdnizer: true
  })
)

webpackConfig.module.rules.push(
  {
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'esbuild-loader',
      options: {
        ...ESBUILD_COMMON_OPTIONS,
        loader: 'jsx'
      }
    }
  },
  {
    test: /\.(jsx|tsx?)$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'esbuild-loader',
      options: ESBUILD_COMMON_OPTIONS
    }
  },
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
