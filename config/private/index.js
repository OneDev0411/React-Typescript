// config/index.js
const env = process.env.NODE_ENV
const filename = ['stage', 'test'].includes(env) ? 'development' : env

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(`./${filename}`)
