import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/signout', async (ctx, next) => {
  ctx.session = null
  const { querystring } = ctx.request
  ctx.redirect(`/signin${querystring ? `?${querystring}` : ''}`)
})

module.exports = app.use(router.routes())
