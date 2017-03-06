import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/transactions/acknowledge-notifications', bodyParser(), async (ctx, next) => {

  const { transaction } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/transactions/${transaction}/notifications`, 'DELETE')

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
