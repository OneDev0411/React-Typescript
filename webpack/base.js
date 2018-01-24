import path from 'path'
import webpack from 'webpack'
import Jarvis from 'webpack-jarvis'
import config from '../config/webpack'

export default {
  devtool: 'eval',
  entry: {},
  output: {
    path: config.compile.output,
    filename: config.compile.jsBundle,
    chunkFilename: '[name].[chunkhash].js',
    publicPath: config.compile.publicPath
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss'],
    modules: [config.compile.entry, 'node_modules']
  },
  plugins: [
    new webpack.DefinePlugin(config.globals),
    new Jarvis({
      port: 1337 // optional: set a port
    })
  ],
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
