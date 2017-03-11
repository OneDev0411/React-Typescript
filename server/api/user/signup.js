import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Room from '../../../app/models/Room'
const router = require('koa-router')()
const app = new Koa()

router.post('/signup', async (ctx, next) => {

  const req = ctx.request
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const email = req.body.email
  const user_type = req.body.user_type
  const password = req.body.password
  const grant_type = req.body.grant_type
  const user_connect = req.body.user_connect
  const room_connect = req.body.room_connect
  const phone_number = req.body.phone_number

  const request_object = {
    client_id: ctx.config.api.client_id,
    client_secret: ctx.config.api.client_secret,
    first_name: first_name,
    last_name: last_name,
    email: email,
    user_type: user_type,
    password: password,
    grant_type: grant_type
  }

  if (user_connect) {
    request_object.user_connect = user_connect
  }

  if (room_connect) {
    request_object.room_connect = room_connect
  }

  if (phone_number) {
    request_object.phone_number = phone_number
  }

  try {
    const response = await ctx.fetch('/users', 'POST')
    .set({ 'x-rechat-brand': req.body.brand ? req.body.brand : '' })
    .send(request_object)

    ctx.body = response.body

  }
  catch(e) {}
})

app.use(bodyParser())
module.exports = app.use(router.routes())
