import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/contacts/stage-update', bodyParser(), async (ctx, next) => {
  const { contact_id, attributes } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/contacts/${contact_id}`, 'PATCH')
      .send({ attributes })
    ctx.body = response.body
  }
  catch(e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
