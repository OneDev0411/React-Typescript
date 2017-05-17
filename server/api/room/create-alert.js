import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()
router.post('/rooms/create-alert', bodyParser(), async (ctx, next) => {

  const { alert, room_id } = ctx.request.body
  
  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/alerts`, 'POST')
      .send({ ...alert })
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
