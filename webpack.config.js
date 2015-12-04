// webpack.config.js
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
  entry: './app/app-client.js',
  output: {
    path: path.join(__dirname, 'app/public/dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot','babel'],
      exclude: /node_modules/
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css!sass')
    }]
  },
  plugins: [
    new ExtractTextPlugin('css/main.css')
 ]
};