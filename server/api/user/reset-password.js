import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Crypto from '../../../server/util/crypto'

const router = require('koa-router')()

const app = new Koa()

router.post('/reset-password', bodyParser(), async (ctx, next) => {
  const { password } = ctx.request.body

  const decoded_token = decodeURIComponent(ctx.request.body.token)
  const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
  const email = decrypted_obj.email
  const token = decrypted_obj.token

  try {
    const response = await ctx.fetch('/users/password', 'PATCH').send({
      email,
      token,
      password
    })

    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
