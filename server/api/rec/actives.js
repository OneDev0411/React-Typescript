import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/recs/get-actives', async (ctx, next) => {

  try {
    const response = await ctx.fetch('/recs/actives?limit=1000')
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
