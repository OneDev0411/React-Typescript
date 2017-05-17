// config/public/index.js
const env = process.env.NODE_ENV
const filename = env === 'staging' ? 'development' : env
module.exports = require('./' + filename )
