import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/recs/mark', bodyParser(), async (ctx, next) => {

  const { recommendations } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/recs/mark', 'PATCH')
      .send({ recommendations })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
