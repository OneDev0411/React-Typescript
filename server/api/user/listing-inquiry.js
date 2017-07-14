import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/user/listing-inquiry', bodyParser(), async (ctx, next) => {
  const { agent, brand, source_type, listing } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/listings/${listing}/inquiry`, 'POST')
      .send({
        agent,
        brand,
        source_type
      })

    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
