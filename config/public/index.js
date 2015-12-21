// config/public/index.js
let env = process.env.NODE_ENV
let env_file = env
if(env === 'staging') env_file = 'development'
const config = require('./' + env_file)
module.exports = config