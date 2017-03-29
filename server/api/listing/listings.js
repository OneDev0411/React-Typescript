import Koa from 'koa'
import validate from 'uuid-validate'
const router = require('koa-router')()
const app = new Koa()

router.get('/listings/:id', async (ctx, next) => {

  const { id } = ctx.params

  // Catch non-uuid
  if (!validate(id))
    return await next()

  try {
    const response = await ctx.fetch(`/listings/${id}`)
    ctx.body = response.body
  }
  catch(e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
