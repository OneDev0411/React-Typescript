import Koa from 'koa'
import MobileDetect from 'mobile-detect'

const router = require('koa-router')()
const app = new Koa()

router.get('/', async (ctx, next) => {
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  if (ctx.session.user && !isMobile.phone()) {
    ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
