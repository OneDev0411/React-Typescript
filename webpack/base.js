import path from 'path'

import webpack from 'webpack'

import HtmlWebpackPlugin from 'html-webpack-plugin'

const env = process.env.NODE_ENV || 'development'
const __DEV__ = env === 'development'

function resolvePath(dirPath) {
  return path.resolve(__dirname, dirPath)
}

export default {
  devtool: 'eval-source-map',
  entry: {
    app: '../app/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: __DEV__ ? 'app.js' : '[name].[hash].js',
    chunkFilename: '[name].[chunkhash].js',
    publicPath: '/',
    globalObject: 'this'
  },
  resolve: {
    modules: [resolvePath('../app'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'],
    alias: {
      store: resolvePath('../app/stores'),
      actions: resolvePath('../app/store_actions'),
      assets: resolvePath('../app/static'),
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
      /* components */
      deals: resolvePath('../app/components/Pages/Dashboard/Deals'),
      crm: resolvePath('../app/components/Pages/Dashboard/Contacts'),
      animations: resolvePath('../app/animations'),
      fixtures: resolvePath('../tests/unit/fixtures')
    }
  },
  plugins: [
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
        AWS_SECRET_ACCESS_KEY: JSON.stringify(
          process.env.AWS_SECRET_ACCESS_KEY
        ),
        ASSETS_BUCKET: JSON.stringify(process.env.ASSETS_BUCKET),
        ASSETS_BASEURL: JSON.stringify(process.env.ASSETS_BASEURL),
        FB_APP_ID: JSON.stringify(process.env.FB_APP_ID),
        RECHAT_SPLITTER_URL: JSON.stringify(process.env.RECHAT_SPLITTER_URL),
        TENOR_API_KEY: JSON.stringify(process.env.TENOR_API_KEY),
        UNSPLASH_API_KEY: JSON.stringify(process.env.UNSPLASH_API_KEY),
        DROPBOX_APP_KEY: JSON.stringify(process.env.DROPBOX_APP_KEY)
      },
      __DEV__,
      NODE_ENV: env,
      __DEBUG__: __DEV__,
      __PROD__: env === 'production'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../app/index.html'),
      hash: false,
      filename: './index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: false
      }
    })
  ],
  externals: {
    fs: '{}'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js)$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, '../app'),
        options: {}
      },
      {
        test: /\.woff(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/font-woff'
          }
        ]
      },
      {
        test: /\.woff2(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/font-woff2'
          }
        ]
      },
      {
        test: /\.otf(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=font/opentype'
          }
        ]
      },
      {
        test: /\.ttf(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=application/octet-stream'
          }
        ]
      },
      {
        test: /\.eot(\?.*)?$/,
        use: [
          {
            loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]'
          }
        ]
      },
      {
        test: /\.svg(\?.*)?$/,
        use: [
          {
            loader:
              'file-loader?prefix=fonts/&name=[path][name].[ext]&mimetype=image/svg+xml'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.(mjml)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(html)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      }
    ]
  }
}
