import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/create-rec', bodyParser(), async (ctx, next) => {

  const { mls_number, notification, room } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/rooms/${room}/recs`, 'POST')
      .send({
        mls_number,
        notification
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
