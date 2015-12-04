// config/index.js
var env = process.env.NODE_ENV
if(env == 'stage') env = 'development'
var config = require('./' + env + '.js')
module.exports = config
