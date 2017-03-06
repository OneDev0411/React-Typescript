import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/rooms', async (ctx, next) => {

  const limit = 10000

  try {
    const response = await ctx.fetch(`/rooms?limit=${limit}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
