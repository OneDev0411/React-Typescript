import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/acknowledge-room-notifications', bodyParser(), async (ctx, next) => {

  const { room } = ctx.request.body

  try {
    const response = await ctx.fetch(`/rooms/${room}/notifications`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
