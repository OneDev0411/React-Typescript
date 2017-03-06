import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/notifications', async (ctx, next) => {

  const { id, notification } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/rooms/${id}/notifications`)
      .send({ notification })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
