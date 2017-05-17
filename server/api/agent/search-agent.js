import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/agents/search', async (ctx, next) => {

  const mlsid = ctx.request.query.mlsid
  try {
    const response = await ctx
      .fetch(`/agents/search?mlsid=${mlsid}`)

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
