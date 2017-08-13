import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/signout', async (ctx, next) => {
  ctx.session.user = null
  ctx.session = null

  const redirect_to = ctx.request.query.redirect_to || '/signin'
  ctx.redirect(redirect_to)
})

module.exports = app.use(router.routes())
