import path from 'path'

import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import views from 'koa-views'
import session from 'koa-session'
import cookie from 'koa-cookie'
import sslify from 'koa-sslify'
import _ from 'underscore'

import config from '../config/private'
import render from './util/render'
import pagesMiddleware from './util/pages'
import fetch from './util/fetch'
import universalMiddleware from './util/universal'
import checkToken from './util/check-token'
import appConfig from '../config/webpack'
import { logger } from './util/logger'

const app = new Koa()
const __DEV__ = process.env.NODE_ENV === 'development'

// webpack configs
const { entry, output, publicPath } = appConfig.compile

// app uses proxy
app.proxy = true

async function development() {
  const koaWebpackMiddleware = await require('koa-webpack')({
    config: require('../webpack.config.babel').default
  })

  app.use(koaWebpackMiddleware)

  app.use(mount(publicPath, serve(path.join(entry, publicPath))))

  // parse pages
  app.use(mount(pagesMiddleware))

  // universal rendering middleware
  app.use(mount(universalMiddleware))
}

async function production() {
  app.use(sslify())

  app.use(
    mount(
      serve(path.join(output), {
        gzip: true,
        maxage: 86400000
      })
    )
  )

  // parse pages
  app.use(mount(pagesMiddleware))

  // universal rendering middleware
  app.use(mount(universalMiddleware))
}

app.use(logger)

// handle application errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // log error
    console.log('[ APP ERROR ]: ', e, e.stack)

    ctx.status = e.status || 500
    ctx.body = e.message || 'Internal Server Error'
    ctx.app.emit('error', e)
  }
})

// attach template engine
const templatesDir = __DEV__
  ? path.resolve(appConfig.compile.entry, 'templates')
  : appConfig.compile.output

// use template engine
app.use(views(templatesDir, { map: { html: 'hogan', ejs: 'ejs' } }))

// use cookies
app.use(cookie())

// check token and refresh that if is required
app.use(checkToken)

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
      gzip: true,
      overwrite: true,
      httpOnly: true,
      signed: true
    },
    app
  )
)

app.use(
  session(
    {
      key: 'rechat-webapp-app:session',
      maxAge: 60 * 86400 * 1000, // 60 days
      gzip: true,
      overwrite: true,
      httpOnly: true,
      signed: true,
      domain: 'app.rechat.com'
    },
    app
  )
)

/**
 * middleware for global variables
 */
app.use(async (ctx, next) => {
  ctx.state.variables = {
    intercomId: config.intercom.app_id,
    sentryKey: config.sentry.api_url
  }

  return next()
})

app.use(fetch())

_.each(require('./api/routes'), route => {
  // eslint-disable-next-line
  app.use(mount('/api', require(route.path)))
})

if (__DEV__) {
  development()
} else {
  production()
}

export default app
