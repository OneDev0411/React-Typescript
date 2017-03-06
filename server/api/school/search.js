import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/schools/search', async (ctx, next) => {

  const { district } = ctx.request.query

  try {
    const response = await ctx.fetch(`/schools/search?districts[]=${district}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
