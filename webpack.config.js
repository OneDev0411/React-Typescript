// webpack.config.js
var loaders = ['babel']
if(process.env.NODE_ENV === 'development')
  loaders = ['react-hot','babel']

var ExtractTextPlugin = require('extract-text-webpack-plugin')
module.exports = {
  entry: './app/app-client.js',
  output: {
    path: __dirname + 'app/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: loaders,
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
}