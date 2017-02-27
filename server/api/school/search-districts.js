import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/schools/districts/search', async (ctx, next) => {

  const { q } = ctx.request.query

  try {
    const response = await ctx.fetch(`/schools/districts/search?q=${q}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
