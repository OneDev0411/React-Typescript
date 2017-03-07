import config from './config/webpack'

// don't show deprecation warning
process.noDeprecation = true

const filename = config.env === 'staging' ? 'development' : config.env
export default require('./webpack/' + filename).default
