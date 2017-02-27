import Koa from 'koa'
const router = require('koa-router')()
const Intercom = require('intercom-client')
import config from '../../../config/private'

const app = new Koa()
const client = new Intercom.Client({
  appId: config.intercom.app_id,
  appApiKey: config.intercom.secret_key
})

router.post('/intercom/signin', async (ctx, next) => {

  const { user } = ctx.request.body

  const intercom_user = {
    user_id: user.id,
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    update_last_request_at: true,
    created_at: user.created_at,
    updated_at: user.update_at,
    last_seen_ip: ctx.request.ip
  }

  client.users.create(intercom_user, r => {})

  ctx.body = {}
})

module.exports = app.use(router.routes())
