import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/areas/search', async (ctx, next) => {

  const { q, parents } = ctx.request.query

  try {
    const response = await ctx.fetch(`/areas/search?parents[]=${parents}&q=${q}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
