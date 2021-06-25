// @ts-nocheck
const { merge } = require('webpack-merge')
const Webpackbar = require('webpackbar')

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
  plugins: [new Webpackbar()],
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
