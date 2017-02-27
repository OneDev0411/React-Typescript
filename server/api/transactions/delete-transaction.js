import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/delete-transaction', bodyParser(), async (ctx, next) => {

  const { id } = ctx.request.query

  try {
    const response = await ctx
      .fetch(`/transactions/${id}`, 'DELETE')

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
