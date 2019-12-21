const env = process.env.NODE_ENV

module.exports = ['production', 'stage'].includes(env)
  ? require('./webpack/production')
  : require('./webpack/development')
