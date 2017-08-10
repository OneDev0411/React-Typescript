import Koa from 'koa'
import User from '../../../../../app/models/User'
import Crypto from '../../../../../app/models/Crypto'
import MobileDetect from 'mobile-detect'

const router = require('koa-router')()
const app = new Koa()

async function getSelf(config, decrypted_obj) {
  return new Promise((resolve, reject) => {
    User.getSelf(
      {
        access_token: decrypted_obj.tokens.access,
        api_host: config.api_host_local
      },
      (err, response) => {
        if (!err && response.data) {
          return resolve(response)
        }
        reject(err)
      }
    )
  })
}

router.get('/signin', async (ctx, next) => {
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  if (isMobile.phone()) {
    let url = '/mobile'
    if (isMobile.is('iPhone')) {
      url = '/mobile?type=iphone'
    }

    return ctx.redirect(url)
  }

  const { token, email, redirect_to } = ctx.request.query

  // Auto sign in
  if (token) {
    const decoded_token = decodeURIComponent(token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))

    if (decrypted_obj.tokens) {
      try {
        const response = await getSelf(ctx.config, decrypted_obj)
        ctx.session.user = {
          ...response.data,
          access_token: decrypted_obj.tokens.access
        }

        return ctx.redirect(redirect_to)
      } catch (e) {}
    }
  }

  if (!token && !email && ctx.session.user) {
    ctx.redirect('/dashboard/mls')
  }

  await next()
})

module.exports = app.use(router.routes())
