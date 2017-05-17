import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/reset_password', async (ctx, next) => {
  const { token } = ctx.request.query
  const decoded_token = decodeURIComponent(token)
  const encoded_token = encodeURIComponent(decoded_token)

  // TODO: test token for validity then redirect to forgot password
  return ctx.redirect('/password/reset/?token=' + encoded_token)
})

module.exports = app.use(router.routes())
