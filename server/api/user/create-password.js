import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Crypto from '../../../server/util/crypto'

const router = require('koa-router')()

const app = new Koa()

router.post('/create-password', bodyParser(), async (ctx, next) => {
  const { email, new_email, phone_number, token, password, agent } = ctx.request.body

  const data = {
    shadow_token: token,
    password
  }

  if (phone_number) {
    data.phone_number = phone_number
  } else {
    data.email = email
  }

  if (agent) {
    data.agent = agent
  }

  try {
    const response = await ctx.fetch('/users/password', 'PATCH').send(data)

    ctx.body = response.body
  } catch (e) {}
})

module.exports = app.use(router.routes())
