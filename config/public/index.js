// config/public/index.js
const env = process.env.NODE_ENV
const filename = ['stage', 'test'].indexOf(env) ? 'development' : env

module.exports = require(`./${filename}`)
