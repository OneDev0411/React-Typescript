import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get(/^\/widgets(?:\/|$)/, async (ctx, next) => {
  await next()
})

module.exports = app.use(router.routes())
