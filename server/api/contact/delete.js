import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/delete-contact', bodyParser(), async (ctx, next) => {

  const { contact_id } = ctx.request.body

  try {
    const response = await ctx.fetch(`/contacts${contact_id}`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
