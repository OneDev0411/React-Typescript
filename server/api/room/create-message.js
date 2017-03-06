import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/create-message', bodyParser(), async (ctx, next) => {

  const { room_id, comment, message_type, author } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/messages`, 'POST')
      .send({
        comment,
        message_type,
        author
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
