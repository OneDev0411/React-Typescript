import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-password', bodyParser(), async (ctx, next) => {

  const { old_password, new_password } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/users/self/password', 'PATCH')
      .send({
        old_password,
        new_password
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
