import Koa from 'koa'

const router = require('koa-router')()

const app = new Koa()

router.get(/^\/dashboard(?:\/|$)/, async (ctx, next) => {
  if (
    !ctx.session.user &&
    ctx.request.url.includes('/dashboard/mls') === false
  ) {
    return ctx.redirect(`/signin?redirect_to=${ctx.request.path}`)
  }

  return next()
})

module.exports = app.use(router.routes())
