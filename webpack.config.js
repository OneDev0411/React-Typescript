// webpack.config.js
var webpack = require('webpack')

var loaders = ['babel']
if(process.env.NODE_ENV === 'development')
  loaders = ['react-hot','babel']
var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// Default loaders
var loaders_module = [
  {
    test: /\.js$/,
    loaders: loaders,
    exclude: /node_modules/
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', 'css!autoprefixer!sass')
  }
]

// Development loaders
if(process.env.NODE_ENV === 'development'){
  var es_lint = {
    test: /\.js$/, 
    loader: 'eslint-loader',
    exclude: /node_modules/
  }
  loaders_module.push(es_lint)
}

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
    loaders: loaders_module,
    noParse: /node_modules\/google-libphonenumber\/dist/
  },
  plugins: [
    new ExtractTextPlugin('css/main.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.APP_URL': JSON.stringify(process.env.APP_URL),
      'process.env.RECHAT_API_URL': JSON.stringify(process.env.RECHAT_API_URL),
      'process.env.SOCKET_SERVER': JSON.stringify(process.env.SOCKET_SERVER),
      'process.env.COSMIC_BUCKET': JSON.stringify(process.env.COSMIC_BUCKET),
      'process.env.COSMIC_KEY': JSON.stringify(process.env.COSMIC_KEY),
      'process.env.CLOUDFRONT_URL': JSON.stringify(process.env.CLOUDFRONT_URL),
      'process.env.IMGIX_URL': JSON.stringify(process.env.IMGIX_URL),
      'process.env.BRANCH_KEY': JSON.stringify(process.env.BRANCH_KEY),
      'process.env.APP_SHARE_URL': JSON.stringify(process.env.APP_SHARE_URL),
      'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY)
    })
 ]
}