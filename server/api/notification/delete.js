import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/delete-notifications', async (ctx, next) => {

  try {
    const response = await ctx
      ctx.fetch('/notifications', 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
