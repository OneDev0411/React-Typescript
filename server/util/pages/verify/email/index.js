import Koa from 'koa'
import super_agent from 'superagent'
import Crypto from '../../../../../app/models/Crypto'
const router = require('koa-router')()
const app = new Koa()

/**
 * /verify_email
 */
router.get('/verify_email', async (ctx, next) => {
  const decoded_token = decodeURIComponent(ctx.request.query.token)
  const encoded_token = encodeURIComponent(decoded_token)
  return ctx.redirect('/verify/email?token=' + encoded_token)
})

/**
 * /verify_email/submitted
 */
router.get('/verify_email/submitted', async (ctx, next) => {
  const decoded_token = decodeURIComponent(ctx.request.query.token)
  const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
  const email = decrypted_obj.email
  const email_code = decrypted_obj.email_code
  const token = decrypted_obj.token
  const agent = decrypted_obj.agent
  const api_url = ctx.config.api.url
  const verify_email_url = api_url + '/users/email_confirmed'

  const request_object = {
    email
  }

  if (email_code) {
    request_object.email_code = email_code
  }

  if (token) {
    request_object.token = token
  }

  if (agent) {
    request_object.agent = agent
  }

  try {
    const response = await super_agent.patch(verify_email_url).send(request_object)

    if (response.data.is_shadow) {
      return ctx.redirect('/verify/email?status=success&token=' + token +
        '&email=' + encodeURIComponent(email))
    } else {
      return ctx.redirect('/signin?message=phone-signup-success')
    }
  }
  catch(e) {
    ctx.redirect('/signin?message=email-already-verified')
  }
})

/**
 * /verify/email
 */
router.get('/verify/email', async (ctx, next) => {
  // Logout user
  ctx.session = null
  const { AppStore } = ctx.locals

  AppStore.data = {
    status: 'success'
  }

  if (ctx.request.query.status === 'error'){
    AppStore.data = {
      status: 'error'
    }
  }

  ctx.locals.AppStore = AppStore
  await ctx.display()
})


module.exports = app.use(router.routes())
