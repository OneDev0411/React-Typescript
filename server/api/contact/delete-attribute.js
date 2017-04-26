import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/contacts/delete-attribute', bodyParser(), async (ctx, next) => {
  const { contact_id, attribute_id } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/contacts/${contact_id}/attributes/${attribute_id}`, 'DELETE')

    ctx.body = response.body
  }
  catch(e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
