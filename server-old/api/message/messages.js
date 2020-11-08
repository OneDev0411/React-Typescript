import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/messages', async ctx => {
  const { room_id, limit, max_value } = ctx.request.query

  try {
    const response = await ctx.fetch(
      `/rooms/${room_id}/messages?limit=${limit}&max_value=${max_value}`
    )

    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
