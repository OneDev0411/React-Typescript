import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/tasks', async (ctx, next) => {

  try {
    const response = await ctx.fetch('/tasks')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
