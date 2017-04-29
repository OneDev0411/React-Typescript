import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/deals/:id/reviews', bodyParser(), async (ctx, next) => {
  const { reviews } = ctx.request.body
  const { id } = ctx.params

  try {
    const response = await ctx
      .fetch(`/deals/${id}/reviews/bulk`, 'POST')
      .send({
        reviews
      })
    ctx.body = response.body
  } catch (error) {
    console.log(error)
  }
})

module.exports = app.use(router.routes())
