import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-favorite', bodyParser(), async (ctx, next) => {

  const { room_id, rec_id, favorite } = ctx.request.body
  try {
    const response = await ctx
      .fetch(`/rooms/${room_id}/recs/${rec_id}/favorite`, 'PATCH')
      .send({
        room_id,
        rec_id,
        favorite
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
