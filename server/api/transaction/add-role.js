import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/transactions/role', bodyParser(), async (ctx, next) => {

  const { id } = ctx.request.query
  const { role } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/transactions/${id}/roles`, 'POST')
      .send({ roles: [role] })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
