import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-contact', bodyParser(), async (ctx, next) => {

  const { contact } = ctx.request.body
  contact.push_allowed = true

  try {
    const response = await ctx
      .fetch(`/contacts/${contact.id}`, 'PUT')
      .send({ contact })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
