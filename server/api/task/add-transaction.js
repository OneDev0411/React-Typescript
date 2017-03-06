import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/add-transaction', bodyParser(), async (ctx, next) => {

  const { task, transaction } = ctx.request.body

  try {
    const response = await ctx
      .fetch(`/tasks/${task}`, 'PUT')
      .send({
        transaction
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
