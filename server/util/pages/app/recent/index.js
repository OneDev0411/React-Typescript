import Koa from 'koa'
import Crypto from '../../../crypto'

const router = require('koa-router')()
const app = new Koa()

async function getUser(params) {
  return new Promise(resolve => {
    User.get(params, (error, response) => {
      resolve(response.data)
    })
  })
}
router.get('/dashboard/recents/:id', async (ctx, next) => {
  const { token, alert } = ctx.request.query

  if (!token) {
    return next()
  }

  const decoded_token = decodeURIComponent(token)
  const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
  const id = decrypted_obj.id
  const tokens = decrypted_obj.tokens
  const access_token = tokens.access

  const response = await getUser({
    api_host: ctx.config.api_host_local,
    id,
    access_token
  })

  const user = response.data

  user.access_token = access_token
  ctx.session.user = user

  let redirect_url = `/dashboard/recents/${ctx.params.id}`

  if (alert) {
    redirect_url = `/dashboard/recents/${ctx.params.id}?alert=${alert}`
  }

  ctx.redirect(redirect_url)
})

module.exports = app.use(router.routes())
