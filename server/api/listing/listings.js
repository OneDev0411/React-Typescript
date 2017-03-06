import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/listings/:id', async (ctx, next) => {

  const { id } = ctx.params

  try {
    const response = await ctx.fetch(`/listings/${id}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
