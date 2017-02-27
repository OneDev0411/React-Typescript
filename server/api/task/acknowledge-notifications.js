import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/acknowledge-notifications', bodyParser(), async (ctx, next) => {

  try {
    const response = await ctx.fetch('/tasks/notifications/', 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
