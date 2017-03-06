import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.delete('/tasks/remove-contact', bodyParser(), async (ctx, next) => {

  const { phone_number } = ctx.request.query

  try {
    const response = await ctx
      .fetch('/admin/users/phone?q=' + encodeURIComponent(phone_number), 'DELETE')

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
