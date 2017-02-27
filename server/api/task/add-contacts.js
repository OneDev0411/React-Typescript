import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/add-contacts', bodyParser(), async (ctx, next) => {

  const { task, contacts } = ctx.request.body
  try {
    const response = await ctx
      .fetch(`/tasks/${task.id}/contacts`, 'POST')
      .send({ contacts })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
