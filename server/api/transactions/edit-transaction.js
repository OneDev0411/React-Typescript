import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-transaction', bodyParser(), async (ctx, next) => {

  const { id } = ctx.request.query
  const { transaction_type, listing_data, user } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/transactions/${id}`, 'PUT')
      .send({
        transaction_type,
        listing_data,
        user
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
