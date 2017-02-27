import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/edit-status', bodyParser(), async (ctx, next) => {

  const { id, status } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/tasks/${id}`, 'PUT')
      .send({
        status
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
