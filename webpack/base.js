import path from 'path'
import webpack from 'webpack'
import config from '../config/webpack'

function resolvePath(dirPath) {
  return path.resolve(__dirname, dirPath)
}

export default {
  devtool: 'eval-source-map',
  entry: {},
  output: {
    path: config.compile.output,
    filename: config.compile.jsBundle,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: config.compile.publicPath
  },
  resolve: {
    modules: [resolvePath('../app'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.css'],
    alias: {
      actions: resolvePath('../app/store_actions'),
      assets: resolvePath('../app/static'),
      components: resolvePath('../app/views/components'),
      constants: resolvePath('../app/constants'),
      dashboard: resolvePath('../app/components/Dashboard'),
      models: resolvePath('../app/models'),
      reducers: resolvePath('../app/reducers'),
      routes: resolvePath('../app/routes'),
      partials: resolvePath('../app/components/Partials'),
      services: resolvePath('../app/services'),
      utils: resolvePath('../app/utils'),
      views: resolvePath('../app/views')
    }
  },
  plugins: [new webpack.DefinePlugin(config.globals)],
  externals: {
    fs: '{}'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: config.compile.entry,
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: ['react', ['es2015', { modules: false }], 'stage-0'],
          env: {
            development: {
              plugins: [
                ['react-hot-loader/babel'],
                [
                  'react-transform',
                  {
                    transforms: [
                      {
                        transform: 'react-transform-catch-errors',
                        imports: ['react', 'redbox-react']
                      }
                    ]
                  }
                ]
              ]
            }
          }
        }
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
      }
    ]
  }
}
