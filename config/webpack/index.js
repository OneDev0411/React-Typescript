/* eslint-disable object-shorthand */
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'

const config = {
  env: env,
  compile: {
    entry: path.resolve(__dirname, '../../app'),
    output: path.resolve(__dirname, '../../dist'),
    publicDirName: 'static',
    publicPath: __DEV__ ? '/static' : '/',
    jsBundle: __DEV__ ? 'app.js' : 'app.[hash].js',
    jsVendorBundle: 'core.[hash].js',
    cssBundle: 'app.[hash].css',
    template: path.resolve(__dirname, '../../app/templates/app.html'),
    vendors: [
      'react',
      'react-dom',
      'react-router',
      'react-redux',
      'moment',
      'lodash',
      'whatwg-fetch',
      'offline-js'
    ]
  },
  globals: {
    'process.env': {
      NODE_ENV: JSON.stringify(env),
      APP_URL: JSON.stringify(process.env.APP_URL),
      RECHAT_API_URL: JSON.stringify(process.env.RECHAT_API_URL),
      SOCKET_SERVER: JSON.stringify(process.env.SOCKET_SERVER),
      COSMIC_BUCKET: JSON.stringify(process.env.COSMIC_BUCKET),
      COSMIC_KEY: JSON.stringify(process.env.COSMIC_KEY),
      CLOUDFRONT_URL: JSON.stringify(process.env.CLOUDFRONT_URL),
      IMGIX_URL: JSON.stringify(process.env.IMGIX_URL),
      BRANCH_KEY: JSON.stringify(process.env.BRANCH_KEY),
      APP_SHARE_URL: JSON.stringify(process.env.APP_SHARE_URL),
      GOOGLE_API_KEY: JSON.stringify(process.env.GOOGLE_API_KEY),
      ITUNES_URL: JSON.stringify(process.env.ITUNES_URL),
      RECHAT_FORMS_URL: JSON.stringify(process.env.RECHAT_FORMS_URL),
      RECHAT_STORE_URL: JSON.stringify(process.env.RECHAT_STORE_URL)
    },
    __DEV__: __DEV__,
    NODE_ENV: env,
    __DEBUG__: __DEV__,
    __PROD__: env === 'production'
  }
}

module.exports = config
