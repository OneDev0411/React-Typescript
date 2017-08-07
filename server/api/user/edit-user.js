import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()
const app = new Koa()

router.post('/edit-user', bodyParser(), async (ctx, next) => {

  const { access_token } = ctx.request.body
  const { first_name, last_name, email, phone_number } = ctx.request.body.user

  try {
    const response = await ctx
      .fetch('/users/self', 'PUT')
      .send({
        first_name,
        last_name,
        email,
        phone_number
      })
    const user = response.body.data

    if (user) {
      ctx.session.user = {
        ...user,
        ...{access_token}
      }
    }

    ctx.body = response.body
  }
  catch(e) {
    // console.log('error:            ', e)

  }
})

module.exports = app.use(router.routes())
