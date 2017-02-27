import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/agents/get-report', bodyParser(), async (ctx, next) => {

  const criteria = ctx.request.body.criteria

  try {
    const response = await ctx
      .fetch('/agents/report', 'POST')
      .send({ criteria })
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
