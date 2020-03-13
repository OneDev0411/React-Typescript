import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import superagent from 'superagent'
import superdebug from 'superagent-debugger'

import {
  NEIGHBORHOODS_API_URL,
  API_CLIENT_ID,
  API_KEY,
  REQUEST_TIMEOUT_MS
} from './constants'

const router = require('koa-router')()
const app = new Koa()

async function sendGetNeighborhoodsRequest(body) {
  const response = await superagent
    .post(NEIGHBORHOODS_API_URL)
    .set('Content-Type', 'application/json')
    .set('X-API-CLIENTID', API_CLIENT_ID)
    .set('X-API-KEY', API_KEY)
    .use(superdebug(console.info))
    .timeout(REQUEST_TIMEOUT_MS)
    .send(body)

  return response
}

router.post(
  '/liveby/neighborhoods',
  bodyParser({ jsonLimit: '10mb' }),
  async ctx => {
    const { user: userSession } = ctx.session

    if (!userSession) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    try {
      const response = await sendGetNeighborhoodsRequest(ctx.request.body)

      ctx.status = response.status
      ctx.body = response.body
    } catch (err) {
      console.error('LiveBy get neighborhoods error', err)
      ctx.status = 500
      ctx.body = {
        error: err
      }
    }
  }
)

module.exports = app.use(router.routes())
