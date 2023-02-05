// @ts-nocheck
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'

function resolvePath(dirPath) {
  return path.resolve(__dirname, dirPath)
}

const postcssOptions = {
  plugins: [
    require('postcss-preset-env')(),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}

module.exports = {
  devtool: 'eval-source-map',
  entry: {
    app: path.resolve(__dirname, '../app/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: __DEV__ ? '[name].bundle.js' : '[name].[fullhash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
    globalObject: 'self',
    assetModuleFilename: '[hash][ext]' // Webpack bby default includes [query] in this, S3 file upload plugin can't handle it.
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: '/tmp/webpack'
  },
  resolve: {
    modules: [resolvePath('../app'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    alias: {
      '@app': resolvePath('../app'),
      store: resolvePath('../app/stores'),
      actions: resolvePath('../app/store_actions'),
      assets: resolvePath('../app/static'),
      styles: resolvePath('../app/styles'),
      components: resolvePath('../app/views/components'),
      constants: resolvePath('../app/constants'),
      dashboard: resolvePath('../app/components/Dashboard'),
      hooks: resolvePath('../app/hooks'),
      models: resolvePath('../app/models'),
      reducers: resolvePath('../app/reducers'),
      routes: resolvePath('../app/routes'),
      partials: resolvePath('../app/components/Partials'),
      services: resolvePath('../app/services'),
      utils: resolvePath('../app/utils'),
      views: resolvePath('../app/views'),
      config: resolvePath('../config/public'),
      selectors: resolvePath('../app/selectors'),
      /* components */
      deals: resolvePath('../app/components/Pages/Dashboard/Deals'),
      crm: resolvePath('../app/components/Pages/Dashboard/Contacts'),
      animations: resolvePath('../app/animations'),
      fixtures: resolvePath('../tests/unit/fixtures'),
      tests: resolvePath('../tests')
    },
    fallback: {
      path: require.resolve('path-browserify'),
      buffer: require.resolve('buffer')
    },
    roots: [resolvePath('../app')]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../app/index.html'),
      hash: false,
      filename: './index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: false
      }
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new webpack.DefinePlugin({
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
        ASSETS_BUCKET: JSON.stringify(process.env.ASSETS_BUCKET),
        ASSETS_BASEURL: JSON.stringify(process.env.ASSETS_BASEURL),
        FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
        RECHAT_SPLITTER_URL: JSON.stringify(process.env.RECHAT_SPLITTER_URL),
        TENOR_API_KEY: JSON.stringify(process.env.TENOR_API_KEY),
        UNSPLASH_API_KEY: JSON.stringify(process.env.UNSPLASH_API_KEY),
        DROPBOX_APP_KEY: JSON.stringify(process.env.DROPBOX_APP_KEY),
        INTERCOM_APP_ID: JSON.stringify(process.env.INTERCOM_APP_ID),
        SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
        SENTRY_ENVIRONMENT: JSON.stringify(process.env.SENTRY_ENVIRONMENT),
        SOURCE_VERSION: JSON.stringify(
          process.env.CI_COMMIT_REF_SLUG || process.env.SOURCE_VERSION
        ),
        MAPBOX_ACCESS_TOKEN: JSON.stringify(process.env.MAPBOX_ACCESS_TOKEN),
        STRIPE_PUBLIC_KEY: JSON.stringify(process.env.STRIPE_PUBLIC_KEY),
        SHOWING_BOOKING_URL: JSON.stringify(process.env.SHOWING_BOOKING_URL),
        ENABLE_FULLSTORY: JSON.stringify(process.env.ENABLE_FULLSTORY),
        NLP_SERVER: JSON.stringify(process.env.NLP_SERVER)
      },
      __DEV__,
      NODE_ENV: env,
      __DEBUG__: __DEV__,
      __PROD__: env === 'production'
    })
  ],
  externals: {
    fs: '{}'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/i,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              plugins: [
                __DEV__ && require.resolve('react-refresh/babel')
              ].filter(Boolean)
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|otf|woff|woff2)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(mjml|njk|html)$/,
        exclude: /index\.html/, // This should be excluded so HtmlWebpackPlugin can read it. https://github.com/webpack/webpack/discussions/14847
        type: 'asset/source'
      },
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
