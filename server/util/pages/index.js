import Koa from 'koa'
import mount from 'koa-mount'
import url from 'url'
import MobileDetect from 'mobile-detect'
import config from '../../../config/private'

const _ = require('underscore')

const app = new Koa()

const routes = {
  app: [['signout'], ['reset_password'], ['listing']]
}

app.use(async (ctx, next) => {
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  const isDashboard = url => url.toLowerCase().indexOf('dashboard') !== -1

  const isListingPage = url =>
    new RegExp(/^\/dashboard\/mls\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/).test(url)

  if (!isDashboard(ctx.url) || (isDashboard(ctx.url) && isListingPage(ctx.url))) {
    // eslint-disable-next-line
    return await next()
  }

  if (isMobile.phone()) {
    let url = '/mobile'

    if (isMobile.is('iPhone')) {
      url = '/mobile?type=iphone'
    }

    return ctx.redirect(url)
  }
  // eslint-disable-next-line
  return await next()
})

app.use(async (ctx, next) => {
  let { session, locals } = ctx
  let { appStore } = locals

  const { data, user } = appStore

  if (!session.user) {
    if (user) {
      delete appStore.user
      delete appStore.data.user
    }
  } else {
    appStore = {
      ...appStore,
      data: {
        ...data,
        user: session.user,
        path: ctx.request.url,
        location: { pathname: ctx.request.url }
      },
      user: session.user
    }
  }

  const newLocals = {
    ...locals,
    appStore
  }

  ctx.config = config
  ctx.locals = newLocals

  await next()
})

_.each(routes, (group, name) => {
  _.each(group, route => {
    // eslint-disable-next-line
    app.use(mount(require(`./${name}/${route[0]}`)))
  })
})

module.exports = app
