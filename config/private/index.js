// config/index.js
const env = process.env.NODE_ENV
const filename = env === 'stage' ? 'development' : env
module.exports = require('./' + filename)
