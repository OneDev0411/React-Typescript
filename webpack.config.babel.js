import config from './config/webpack'
export default require('./webpack/' + config.env).default
