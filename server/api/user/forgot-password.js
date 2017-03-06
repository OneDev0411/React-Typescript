import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/forgot-password', bodyParser(), async (ctx, next) => {

  const { email } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/users/reset_password', 'POST')
      .send({ email })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
