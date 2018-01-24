// config/public/index.js
const env = process.env.NODE_ENV
const filename = ['stage', 'test'].indexOf(env) > -1 ? 'development' : env

module.exports = require('./' + filename)
