import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Room from '../../../app/models/Room'
const router = require('koa-router')()
const app = new Koa()

router.post('/signin', async (ctx, next) => {

  const email = ctx.request.body.email
  const password = ctx.request.body.password
  const invite = ctx.request.body.invite

  try {
    const response = await ctx.fetch('/oauth2/token', 'POST')
    .withCredentials()
    .send({
      client_id: ctx.config.api.client_id,
      client_secret: ctx.config.api.client_secret,
      username: email,
      password: password,
      grant_type: 'password'
    })

    const user = response.body.data
    user.access_token = response.body.access_token
    user.refresh_token = response.body.refresh_token

    // store session
    ctx.session.user = user

    // check for invite vars
    if (invite) {

      // add user to room
      Room.addUser({
        room_id: invite.room_id,
        user: user.id,
        access_token: invite.invite_token,
        api_host: ctx.config.app_url
      }, (err, response) => {})
    }

    ctx.body = response.body
  }
  catch(e) {}
})

app.use(bodyParser())
module.exports = app.use(router.routes())
