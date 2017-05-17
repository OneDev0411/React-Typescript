import Koa from 'koa'
const router = require('koa-router')()
const app = new Koa()

router.get('/users/search', async (ctx, next) => {
  let query_string
  const { q } = ctx.request.query
  const query_array = q.split(' ')

  query_array.forEach(string => {
    if (!query_string) {
      query_string = 'q[]=' + string
    }
    else {
      query_string += '&q[]=' + string
    }
  })

  try {
    const response = await ctx.fetch(`/users/search?limit=1000000&${query_string}`)
    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
