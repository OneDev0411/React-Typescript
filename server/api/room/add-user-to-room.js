import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/add-user-to-room', async (ctx, next) => {

  const { user, room_id } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/users`, 'POST')
      .send({ user: [user] })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
