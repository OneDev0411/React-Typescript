import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/get-actives', async (ctx, next) => {

  const { room_id } = ctx.request.query
  try {
    const response = await ctx.fetch(`'/rooms/${room_id}/recs/actives`)

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
