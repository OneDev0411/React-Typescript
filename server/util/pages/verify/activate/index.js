import Koa from 'koa'
import Crypto from '../../../../../app/models/Crypto'
const router = require('koa-router')()
const app = new Koa()

router.get('/activate', async (ctx, next) => {

  const { action, listing_id, room_id, alert_id } = ctx.request.query
  const decoded_token = decodeURIComponent(ctx.request.query.token)
  const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
  const email = decrypted_obj.email
  const token = decrypted_obj.token
  const agent = decrypted_obj.agent
  const phone_number = decrypted_obj.phone_number
  const inviting_user = decrypted_obj.inviting_user
  const room = decrypted_obj.room

  // Reset session and save branch data
  const branch_data = decrypted_obj

  ctx.session.user = {}
  ctx.session.branch_data = branch_data

  // Agent
  if (agent) {
    const first_name = agent.first_name
    const last_name = agent.last_name
    const id = agent.id
    return ctx.redirect('/password/create?token=' + encodeURIComponent(token) +
      '&email=' + encodeURIComponent(email) +
      '&first_name=' + encodeURIComponent(first_name) +
      '&last_name=' + encodeURIComponent(last_name) +
      '&agent=' + id
    )
  }

  // Client
  if (token && email) {
    let url = '/password/create?token=' + encodeURIComponent(token) +
      '&email=' + encodeURIComponent(email)

    if (action) {
      url += '&action=' + action
    }

    if (listing_id) {
      url += '&listing_id=' + listing_id
    }

    if (room_id) {
      url += '&room_id=' + room_id
    }

    if (alert_id) {
      url += '&alert_id=' + alert_id
    }

    return ctx.redirect(url)
  }

  // Invite SMS
  if (phone_number && inviting_user && room) {
    return ctx.redirect('/signup?phone_number=' + encodeURIComponent(phone_number) +
      '&inviting_user=' + encodeURIComponent(inviting_user) +
      '&room=' + encodeURIComponent(room)
    )
  }

  return ctx.redirect('/?message=error')
})

module.exports = app.use(router.routes())
