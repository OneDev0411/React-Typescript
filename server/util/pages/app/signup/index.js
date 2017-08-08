import Koa from 'koa'
import Crypto from '../../../../../app/models/Crypto'
import MobileDetect from 'mobile-detect'

const router = require('koa-router')()
const app = new Koa()

router.get('/signup', async (ctx, next) => {
  const { token } = ctx.request.query
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  if (token) {
    const decoded_token = decodeURIComponent(token)
    const encoded_token = encodeURIComponent(decoded_token)
    return ctx.redirect(`/activate?token=${encoded_token}`)
  }

  if (ctx.session.user && !isMobile.phone()) {
    return ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
