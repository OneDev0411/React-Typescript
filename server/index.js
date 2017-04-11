import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import views from 'koa-views'
import cookie from 'koa-cookie'
import path from 'path'
import webpack from 'webpack'
import session from 'koa-session'
import _ from 'underscore'

import universalMiddleware from './util/universal'
import pagesMiddleware from './util/pages'
import render from './util/render'
import request from './util/request'
import webpackConfig from '../webpack.config.babel'
import appConfig from '../config/webpack'

const app = new Koa()

// webpack variables
const { entry, output, publicPath } = appConfig.compile

// app uses proxy
app.proxy = true

const __DEV__ = process.env.NODE_ENV === 'development'

// handle application errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch(e) {

    // log error
    console.log(e, e.stack)

    ctx.status = e.status || 500
    ctx.body = e.message || 'Internal Server Error'
    ctx.app.emit('error', err, ctx)
  }
})

// attach template engine
const templatesDir = __DEV__ ?
  path.resolve(appConfig.compile.entry, 'templates') :
  appConfig.compile.output

// use template engine
app.use(views(templatesDir, { map: { html: 'hogan' } }))

// use cookies
app.use(cookie())

// use renders
app.use(render())

/**
 * middleware for session
 */
app.keys = ['r3ch4t@re4ct_rocks!!!']
app.use(session({
  key: 'rechat-web:sess',
  maxAge: 86400000,
  overwrite: true,
  httpOnly: true,
  signed: true
}, app))

/**
 * middleware for time
 */
app.use(async function(ctx, next) {
  ctx.locals = {}

  ctx.locals.time = (new Date).getTime()

  if (ctx.session && ctx.session.branch_data) {
    ctx.locals.branch_data = JSON.stringify(ctx.session.branch_data)
    delete ctx.session.branch_data
  }

  await next()
})

// add request middleware
app.use(mount('/api', request))

// eslint-disable-next-line
_.each(require('./api/routes'), function(r) {
  app.use(mount('/api', require(r.path)))
})

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

// parse pages
app.use(mount(pagesMiddleware))

// universal rendering middleware
app.use(mount(universalMiddleware))

export default app
