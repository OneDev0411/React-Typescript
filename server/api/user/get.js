import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/users/get-user/:id', async (ctx, next) => {

  const { id } = ctx.request.params

  try {
    const response = await ctx.fetch(`/users/${id}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
