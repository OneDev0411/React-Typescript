import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/cluster-mls', bodyParser(), async (ctx, next) => {
  try {
    const response = await ctx
      .fetch('/valerts', 'POST')
      .send(ctx.request.body)
    ctx.body = response.body
  } catch (error) {
    console.log(error)
  }
})

module.exports = app.use(router.routes())
