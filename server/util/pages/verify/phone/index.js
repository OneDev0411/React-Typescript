import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/verify_phone', async (ctx, next) => {
  const { token } = ctx.request.query
  const decoded_token = decodeURIComponent(token)
  const encoded_token = encodeURIComponent(decoded_token)
  return ctx.redirect('/verify/phone?token=' + encoded_token)
})

module.exports = app.use(router.routes())
