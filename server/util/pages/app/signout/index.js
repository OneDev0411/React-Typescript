import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/signout', async (ctx, next) => {
  ctx.session = null
  ctx.redirect('/signin')
})

module.exports = app.use(router.routes())
