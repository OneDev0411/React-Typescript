import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Room from '../../../app/models/Room'
const router = require('koa-router')()
const app = new Koa()

router.post('/signup-shadow', async (ctx, next) => {

  const req = ctx.request
  const email = req.body.email
  const password = req.body.password
  const user_connect = req.body.user_connect
  const room_connect = req.body.room_connect
  const phone_number = req.body.phone_number
  const actions = req.body.actions

  const request_object = {
    client_id: ctx.config.api.client_id,
    client_secret: ctx.config.api.client_secret,
    email: email,
    first_name: email,
    last_name: '',
    user_type: 'Client',
    password: password,
    grant_type: 'password',
    is_shadow: true
  }
  console.log(request_object)
  if (user_connect) {
    request_object.user_connect = user_connect
  }

  if (room_connect) {
    request_object.room_connect = room_connect
  }

  if (phone_number) {
    request_object.phone_number = phone_number
  }

  if (actions) {
    request_object.actions = actions
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
