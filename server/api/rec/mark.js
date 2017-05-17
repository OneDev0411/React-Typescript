import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/recs/mark', bodyParser(), async (ctx, next) => {

  const { room_id, alert_id } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/recs/feed?filter=${alert_id}`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
