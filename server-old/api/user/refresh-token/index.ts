import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

import signin from '../../../../app/models/auth/signin'
import config from '../../../../config/private'

const router = new Router()
const app = new Koa()

interface RequestBody {
  access_token: string
  refresh_token: string
}

router.post('/user/refresh-token', bodyParser({}), async (ctx: Koa.Context) => {
  try {
    const { user } = ctx.session
    const body = ctx.request.body as RequestBody

    ctx.assert(body.access_token, 400, 'Invalid access token')
    ctx.assert(body.refresh_token, 400, 'Invalid refresh token')

    if (!user || user.access_token !== body.access_token) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    const { access_token, refresh_token, expires_in } = await signin({
      refresh_token: ctx.session.user.refresh_token,
      grant_type: 'refresh_token',
      client_id: config.api.client_id,
      client_secret: config.api.client_secret
    })

    ctx.session.user = {
      access_token,
      refresh_token,
      expire_date: Date.now() + expires_in * 1000
    }

    ctx.body = {
      access_token,
      refresh_token
    }
  } catch (e) {
    console.log(e)
    throw e
  }
})

module.exports = app.use(router.routes())
