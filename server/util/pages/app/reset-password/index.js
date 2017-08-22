import Koa from 'koa'
import Crypto from '../../../crypto'
const router = require('koa-router')()
const app = new Koa()

router.get('/password/reset', async (ctx, next) => {
  const { token } = ctx.request.query
  if (!token) {
    return ctx.redirect('/404')
  }

  let decodedToken = await Crypto.decrypt(decodeURIComponent(token))
  try {
    decodedToken = JSON.parse(decodedToken)
  } catch (error) {
    return ctx.redirect('/oops')
  }

  await next()
})

module.exports = app.use(router.routes())
