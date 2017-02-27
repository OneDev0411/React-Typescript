import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/listings/similars', async (ctx, next) => {

  const { mls_number } = ctx.request.query

  try {
    const response = await ctx.fetch(`/listings/${mls_number}/similars`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
