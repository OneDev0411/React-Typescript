import signin from '../../../app/models/auth/signin/index.js'
import config from '../../../config/private'

export default async function checkToken(ctx, next) {
  if (
    !ctx.session.user ||
    new Date().getTime() <= ctx.session.user.expire_date
  ) {
    return next()
  }

  console.log('[ + ] Refreshing user token')

  try {
    const { access_token, refresh_token, expires_in } = await signin({
      refresh_token: ctx.session.user.refresh_token,
      grant_type: 'refresh_token',
      client_id: config.api.client_id,
      client_secret: config.api.client_secret
    })

    ctx.session.user = {
      access_token,
      refresh_token,
      expire_date: new Date().getTime() + expires_in * 1000
    }
  } catch (e) {
    console.log(e)
  }

  return next()
}
