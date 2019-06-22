// https://github.com/cypress-io/cypress-webpack-preprocessor/issues/13
const webpack = require('@cypress/webpack-preprocessor')

const config = {
  resolve: {
    modules: ['../../../node_modules'],
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-typescript']
            }
          }
        ]
      }
    ]
  }
}

module.exports = on => {
  const options = {
    webpackOptions: config,
    watchOptions: {}
  }

  on('file:preprocessor', webpack(options))
}
