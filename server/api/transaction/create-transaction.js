import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/create-transaction', bodyParser(), async (ctx, next) => {

  const { transaction_type, title, listing, listing_data,
    contract_price, roles, dates } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/transactions', 'POST')
      .send({
        transaction_type,
        title,
        listing,
        listing_data,
        contract_price,
        roles,
        dates
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
