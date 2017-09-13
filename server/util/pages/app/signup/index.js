import Koa from 'koa'
import Crypto from '../../../crypto'
import MobileDetect from 'mobile-detect'

const router = require('koa-router')()
const app = new Koa()

router.get('/signup', async (ctx, next) => {
  if (ctx.session.user) {
    return ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
