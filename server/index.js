import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import views from 'koa-views'
import cookie from 'koa-cookie'
import path from 'path'
import webpack from 'webpack'
import _ from 'underscore'

import universalMiddleware from './util/universal'
import webpackConfig from '../webpack.config.babel'
import appConfig from '../config/webpack'
// import routes from './routes'

const app = new Koa()
const __DEV__ = process.env.NODE_ENV === 'development'

// attach template engine
const templatesDir = __DEV__ ?
  path.resolve(appConfig.compile.entry, 'templates') :
  appConfig.compile.output

// use template engine
app.use(views(templatesDir, { map: { html: 'nunjucks' } }))

// use cookies
app.use(cookie())

const { entry, output, publicPath } = appConfig.compile

if (__DEV__) {
  // eslint-disable-next-line global-require
  const webpackDevMiddleware = require('./util/webpack-dev').default
  // eslint-disable-next-line global-require
  const webpackHMRMiddleware = require('./util/webpack-hmr').default

  const compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, publicPath))
  app.use(webpackHMRMiddleware(compiler))

  app.use(mount(publicPath, serve(path.join(entry, publicPath))))
} else {
  app.use(mount(serve(path.join(output))))
}

// eslint-disable-next-line
// _.each(routes, r => app.use(mount('/api', require(r.path))))

// universal rendering middleware
app.use(mount(universalMiddleware))

export default app
