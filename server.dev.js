'use strict'
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
var hogan = require('hogan-express')

var express = require('express')
var url = require('url')

var app = express();
app.engine('html', hogan)
app.set('views', __dirname + '/app/public')
app.use('/', express.static(__dirname + '/app/public/'))

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/app/public/index.html')
});

var server = new WebpackDevServer(webpack(config), {
    contentBase: __dirname,
    hot: true,
    quiet: false,
    noInfo: false,
    publicPath: "/public/",

    stats: { colors: true }
})
app.listen(8080)