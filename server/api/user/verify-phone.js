import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Crypto from '../../../server/util/crypto'

const router = require('koa-router')()

const app = new Koa()

router.post('/verify-phone', bodyParser(), async (ctx, next) => {
  const { code } = ctx.request.body

  const decoded_token = decodeURIComponent(ctx.request.body.token)
  const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
  const phone_number = decrypted_obj.phone_number
  const phone_code = decrypted_obj.phone_code

  // Validate submitted_code against token code
  if (code !== phone_code) {
    ctx.body = {
      status: 'error'
    }

    return
  }

  try {
    const response = await ctx.fetch('/users/phone_confirmed', 'PATCH').send({
      phone_number,
      code: phone_code
    })

    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
