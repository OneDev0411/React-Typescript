import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/user/get-favorites', async (ctx, next) => {

  try {
    const response = await ctx.fetch('/user/favorites')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
