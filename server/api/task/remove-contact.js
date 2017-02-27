import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/remove-contact', bodyParser(), async (ctx, next) => {

  const { task, contact } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/tasks/${task.id}/contacts/${contact.id}`, 'DELETE')

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
