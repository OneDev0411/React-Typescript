// config/index.js
const env = process.env.NODE_ENV
const filename = env === 'stage' ? 'development' : env

// eslint-disable-next-line import/no-dynamic-require
module.exports = require(`./${filename}`)
