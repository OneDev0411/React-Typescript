import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/delete-room-notifications', async (ctx, next) => {
  const { room } = ctx.request.query
  try {
    const response = await ctx
      .fetch(`/rooms/${room}/notifications`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
