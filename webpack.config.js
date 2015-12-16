// webpack.config.js
var loaders = ['babel']
if(process.env.NODE_ENV === 'development')
  loaders = ['react-hot','babel']
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  devServer: {
    port: process.env.DEV_PORT
  },
  entry: './app/app-client.js',
  output: {
    path: path.join(__dirname, 'app/public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: loaders,
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        test: /\.js$/, 
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/main.css')
 ]
}