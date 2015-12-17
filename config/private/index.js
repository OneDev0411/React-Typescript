// config/index.js
let env = process.env.NODE_ENV
let env_file = env
if(env === 'staging') env_file = 'development'
if(env === 'build') env_file = 'production'
const config = require('./' + env_file)
module.exports = config