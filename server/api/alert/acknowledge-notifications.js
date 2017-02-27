import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/acknowledge-alert-notifications', bodyParser(), async (ctx, next) => {

  const { alert } = ctx.request.body

  try {
    const response = await ctx.fetch(`/alerts/${alert}/notifications`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
