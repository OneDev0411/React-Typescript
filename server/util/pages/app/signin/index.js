import Koa from 'koa'
import MobileDetect from 'mobile-detect'

const router = require('koa-router')()
const app = new Koa()

router.get('/signin', async (ctx, next) => {
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  if (isMobile.phone()) {
    let url = '/mobile'

    if (isMobile.is('iPhone')) {
      url = '/mobile?type=iphone'
    }

    return ctx.redirect(url)
  }

  if (ctx.session.user) {
    ctx.redirect('/dashboard/mls')
  }

  return next()
})

module.exports = app.use(router.routes())
