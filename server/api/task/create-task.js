import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/tasks', bodyParser(), async (ctx, next) => {

  const { title, due_date } = ctx.request.body
  const private_ = ctx.request.body.private

  try {
    const response = await ctx
      .fetch('/tasks', 'POST')
      .send({
        title,
        status: 'New',
        private: private_,
        due_date
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
