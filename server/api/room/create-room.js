import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/create-room', bodyParser(), async (ctx, next) => {

  const { users, emails, phone_numbers, owner } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/rooms', 'POST')
      .send({
        users,
        emails,
        phone_numbers,
        client_type: 'Unknown',
        room_type: 'Group',
        owner
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
