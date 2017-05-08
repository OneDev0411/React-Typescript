import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/get-notifications', async (ctx, next) => {
  try {
    const response = await ctx.fetch('/notifications?limit=75')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
