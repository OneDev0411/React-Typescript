// @ts-nocheck
const { merge } = require('webpack-merge')
const Webpackbar = require('webpackbar')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const common = require('./base')

const postcssOptions = {
  plugins: [
    require('postcss-preset-env')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}

const config = {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false
    }),
    new Webpackbar(),
    new ForkTsCheckerWebpackPlugin({
      /**
       * This is crucial in development, as it doesn't block webpack compilation
       * while typechecking is in progress.
       */
      async: true,
      /**
       * Syntactic errors are checked by babel too, so we turn it off for a small
       * performance gain.
       */
      typescript: {
        useTypescriptIncrementalApi: true,

        diagnosticOptions: {
          syntactic: true
        }
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions
            }
          }
        ]
      },
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  }
}

module.exports = merge(common, config)
