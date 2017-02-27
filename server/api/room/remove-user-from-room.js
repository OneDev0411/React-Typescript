import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/remove-user-from-room', async (ctx, next) => {

  const { room_id, user } = ctx.request.query

  try {
    const response = await ctx.fetch(`'/rooms/${room_id}/users/${user}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
