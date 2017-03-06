import config from './config/webpack'

// don't show deprecation warning
process.noDeprecation = true

export default require('./webpack/' + config.env).default
