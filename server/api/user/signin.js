import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import Room from '../../../app/models/Room'
const router = require('koa-router')()
const app = new Koa()

function addUser(add_user_params) {
  return new Promise(resolve => {
    Room.addUser(add_user_params, (err, response) => {
      resolve()
    })
  })
}

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

    // store session
    ctx.session.user = user

    // check for invite vars
    if (invite) {
      const add_user_params = {
        room_id: invite.room_id,
        user: user.id,
        access_token: invite.invite_token,
        api_host: ctx.config.app_url
      }

      await addUser(add_user_params)
    }

    ctx.body = response.body
  }
  catch(e) {
    console.log(e)
  }
})

app.use(bodyParser())
module.exports = app.use(router.routes())
