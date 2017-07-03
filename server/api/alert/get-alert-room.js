import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/alerts/get-alert-room', async (ctx, next) => {
  const { room_id, alert_id, timestamp } = ctx.request.query
  const limit = ctx.request.query.limit || 50

  let endpoint = `/rooms/${room_id}/recs/feed?filter=${alert_id}&sorting_value=Update&limit=${limit}`

  if (timestamp) {
    endpoint += `&max_value=${timestamp}`
  }

  try {
    const response = await ctx.fetch(endpoint)
    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
