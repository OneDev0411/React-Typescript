import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/upgrade-account', bodyParser(), async (ctx, next) => {

  const { agent, secret } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/users/self/upgrade', 'PATCH')
      .send({
        agent,
        secret
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
