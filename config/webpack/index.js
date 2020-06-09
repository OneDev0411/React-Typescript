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
    publicPath: __DEV__ ? '/static' : null,
    jsBundle: __DEV__ ? 'app.js' : '[name].[hash].js',
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
      'underscore',
      'offline-js'
    ]
  },
  globals: {
    'process.env': {
      NODE_ENV: JSON.stringify(env),
      E2E: JSON.stringify(process.env.E2E),
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
      RECHAT_STORE_URL: JSON.stringify(process.env.RECHAT_STORE_URL),
      AWS_ACCESS_KEY: JSON.stringify(process.env.AWS_ACCESS_KEY),
      AWS_SECRET_ACCESS_KEY: JSON.stringify(process.env.AWS_SECRET_ACCESS_KEY),
      ASSETS_BUCKET: JSON.stringify(process.env.ASSETS_BUCKET),
      ASSETS_BASEURL: JSON.stringify(process.env.ASSETS_BASEURL),
      FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
      RECHAT_SPLITTER_URL: JSON.stringify(process.env.RECHAT_SPLITTER_URL),
      TENOR_API_KEY: JSON.stringify(process.env.TENOR_API_KEY),
      UNSPLASH_API_KEY: JSON.stringify(process.env.UNSPLASH_API_KEY),
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      DROPBOX_APP_KEY: JSON.stringify(process.env.DROPBOX_APP_KEY),
      SOURCE_VERSION: JSON.stringify(process.env.SOURCE_VERSION)
    },
    __DEV__: __DEV__,
    NODE_ENV: env,
    __DEBUG__: __DEV__,
    __PROD__: env === 'production'
  }
}

module.exports = config
