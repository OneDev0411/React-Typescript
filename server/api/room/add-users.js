import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/rooms/add-users', bodyParser(), async (ctx, next) => {
  const headers = {}
  const { room_id, brand, users, emails, phone_numbers } = ctx.request.body
  if (brand) {
    headers['x-rechat-brand'] = brand
  }
  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/users`, 'POST')
      .send({
        users,
        emails,
        phone_numbers
      })
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
