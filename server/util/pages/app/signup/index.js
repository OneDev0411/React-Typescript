import Koa from 'koa'
import Crypto from '../../../../../app/models/Crypto'
const router = require('koa-router')()
const app = new Koa()

router.get('/signup', async (ctx, next) => {

  if (ctx.session.user) {
    return ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
