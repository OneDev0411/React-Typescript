import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks/delete-task', async (ctx, next) => {

  const { id } = ctx.request.body

  try {
    const response = await ctx.fetch(`/tasks/${id}`, 'DELETE')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
