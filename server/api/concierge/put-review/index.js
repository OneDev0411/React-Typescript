import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/concierge/reviews/:id/edit', bodyParser(), async (ctx, next) => {
  const { state, comment } = ctx.request.body
  const { id } = ctx.params

  try {
    const response = await ctx
      .fetch(`/reviews/${id}`, 'PUT')
      .send({
        state,
        comment
      })
    ctx.body = response.body
  } catch (error) {
    console.log(error)
  }
})

module.exports = app.use(router.routes())
