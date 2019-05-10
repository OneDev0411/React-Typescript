import path from 'path'

import { createReadStream } from 'fs'

import Koa from 'koa'
import mount from 'koa-mount'
import serve from 'koa-static'
import views from 'koa-views'
import session from 'koa-session'
import cookie from 'koa-cookie'
import Router from 'koa-router'
import { default as sslify } from 'koa-sslify'

import webpack from 'webpack'
import _ from 'underscore'

import config from '../config/private'
import render from './util/render'
import pagesMiddleware from './util/pages'
import fetch from './util/fetch'
import universalMiddleware from './util/universal'
import appConfig from '../config/webpack'
import webpackConfig from '../webpack.config.babel'

const app = new Koa()
const router = new Router()
const __DEV__ = process.env.NODE_ENV === 'development'

// webpack configs
const { entry, output, publicPath } = appConfig.compile

// app uses proxy
app.proxy = true

if (!__DEV__) {
  app.use(sslify())
}

// handle application errors
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    // log error
    console.log('[ APP ERROR ]: ', e, e.stack)

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
app.use(views(templatesDir, { map: { html: 'hogan', ejs: 'ejs' } }))

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
      gzip: true,
      overwrite: true,
      httpOnly: true,
      signed: true
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

router.get(
  '/',
  async ctx => await ctx.render('_website/index.ejs', { title: 'Rechat' })
)

router.get(
  '/faq',
  async ctx => await ctx.render('_website/faq.ejs', { title: 'FAQ | Rechat' })
)

router.get(
  '/contact',
  async ctx =>
    await ctx.render('_website/contact.ejs', { title: 'Learn More | Rechat' })
)

router.get(
  '/about',
  async ctx =>
    await ctx.render('_website/about.ejs', { title: 'About | Rechat' })
)

app.use(router.routes())

const development = async () => {
  const koaWebpack = require('koa-webpack')

  const middleware = await koaWebpack({
    config: webpackConfig
  })

  app.use(middleware)

  app.use(mount(publicPath, serve(path.join(entry, publicPath))))

  // parse pages
  app.use(mount(pagesMiddleware))

  // universal rendering middleware
  app.use(mount(universalMiddleware))
}

const production = async () => {
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

if (__DEV__) {
  development()
} else {
  production()
}

export default app
