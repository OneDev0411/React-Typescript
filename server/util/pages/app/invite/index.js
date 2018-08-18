import Koa from 'koa'

const router = require('koa-router')()

import Room from '../../../../../app/models/Room'

const app = new Koa()

async function addUser(params) {
  return new Promise((resolve, reject) => {
    Room.addUser(params, err => {
      if (err) {
        return reject()
      }

      return resolve()
    })
  })
}

router.get('/invite', async ctx => {
  const { room_id, invite_token } = ctx.request.query

  // If already signed in
  if (ctx.session.user) {
    const user = ctx.session.user
    const add_user_params = {
      room_id,
      user: user.id,
      access_token: invite_token,
      api_host: ctx.config.app_url
    }

    try {
      await addUser(add_user_params)
      ctx.redirect(`/dashboard/recents/${room_id}`)
    } catch (e) {
      ctx.redirect('/?error=add-user-to-room')
    }
  } else {
    return ctx.redirect(
      `/signin?message=invite-room&room_id=${room_id}&invite_token=${invite_token}`
    )
  }
})

module.exports = app.use(router.routes())
