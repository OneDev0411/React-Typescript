import Koa from 'koa'
const router = require('koa-router')()
import AppStore from '../../../../../app/stores/AppStore'
const app = new Koa()

router.get(/^\/dashboard(?:\/|$)/, async (ctx, next) => {

  if (ctx.session.user){
    AppStore.data.user = ctx.session.user
    AppStore.data.path = ctx.request.url
    AppStore.data.location = { pathname: ctx.request.url }
    ctx.locals.AppStore = JSON.stringify(AppStore)
    return await ctx.display()
  } else {
    // If mls listing
    if (ctx.request.url.indexOf('/dashboard/mls/') === -1) {
      return ctx.redirect(`/signin?redirect_to=${ctx.request.path}`)
    }
  }

  await next()
})

module.exports = app.use(router.routes())
