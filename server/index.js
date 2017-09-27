import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import views from 'koa-views'
import cookie from 'koa-cookie'
import session from 'koa-session'
import path from 'path'
import webpack from 'webpack'
import _ from 'underscore'

import config from '../config/private'
import render from './util/render'
import request from './util/request'
import pagesMiddleware from './util/pages'
import universalMiddleware from './util/universal'
import appConfig from '../config/webpack'
import webpackConfig from '../webpack.config.babel'
// import AppStore from '../app/stores/AppStore'

const app = new Koa()
const __DEV__ = process.env.NODE_ENV === 'development'

// webpack configs
const { entry, output, publicPath } = appConfig.compile

// app uses proxy
app.proxy = true

// handle application errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // log error
    console.log(e, e.stack)

    ctx.status = e.status || 500
    ctx.body = e.message || 'Internal Server Error'
    ctx.app.emit('error', e, ctx)
  }
})

// attach template engine
const templatesDir = __DEV__
  ? path.resolve(appConfig.compile.entry, 'templates')
  : appConfig.compile.output

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

app.use(
  session(
    {
      key: 'rechat-webapp:session',
      maxAge: 60 * 86400 * 1000, // 60 days
      overwrite: true,
      httpOnly: true,
      signed: true
    },
    app
  )
)

/**
 * middleware for time and initial appStore
 */

app.use(async (ctx, next) => {
  ctx.locals = {
    ...ctx.locals,
    intercomId: config.intercom.app_id,
    appStore: { data: {} },
    time: new Date().getTime()
  }

  await next()
})

// add request middleware
app.use(request())

_.each(require('./api/routes'), route => {
  // eslint-disable-next-line
  app.use(mount('/api', require(route.path)))
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
  app.use(
    mount(
      serve(path.join(output), {
        gzip: true,
        maxage: 86400000
      })
    )
  )
}

// parse pages
app.use(mount(pagesMiddleware))

// universal rendering middleware
app.use(mount(universalMiddleware))

export default app
