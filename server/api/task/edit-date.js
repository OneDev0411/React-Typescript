import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/edit-date', bodyParser(), async (ctx, next) => {

  const { id, due_date } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/tasks/${id}`, 'POST')
      .send({ due_date })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
