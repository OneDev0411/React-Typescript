import Koa from 'koa'
import Crypto from '../../../crypto'

const router = require('koa-router')()
const app = new Koa()

router.get('/reset_password', async ctx => {
  const { token: codedToken } = ctx.request.query

  if (!codedToken) {
    return ctx.redirect('/404')
  }

  try {
    let { token, email } = JSON.parse(Crypto.decrypt(codedToken))

    token = encodeURIComponent(token)
    email = encodeURIComponent(email)

    return ctx.redirect(`/password/reset?token=${token}&email=${email}`)
  } catch (error) {
    console.log(error)

    return ctx.redirect('/oops')
  }
})

module.exports = app.use(router.routes())
