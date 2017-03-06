import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-profile-pic', bodyParser(), async (ctx, next) => {

  const { profile_image_url } = ctx.request.body

  try {
    const response = await ctx
      .fetch('/users/self/profile_image_url', 'PATCH')
      .send({
        profile_image_url
      })

    ctx.body = response.body
  }
  catch(e) {}
})

module.exports = app.use(router.routes())
