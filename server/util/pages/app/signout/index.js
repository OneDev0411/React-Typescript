import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/signout', async ctx => {
  ctx.session = null

  const { querystring } = ctx.request
  const { redirectFromSignout, redirect_to } = ctx.request.query
  let redirect = redirectFromSignout || redirect_to || '/signin'

  redirect += redirect === '/signin' && querystring ? `?${querystring}` : ''
  ctx.redirect(redirect)
})

module.exports = app.use(router.routes())
