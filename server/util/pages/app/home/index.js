import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/', async (ctx, next) => {
  if (ctx.session.user) {
    ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
