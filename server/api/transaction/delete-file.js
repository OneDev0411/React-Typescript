import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/transactions/delete-file', bodyParser(), async (ctx, next) => {

  const { id } = ctx.request.query
  const { file } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/transactions/${id}/attachments/${file}`, 'DELETE')

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
