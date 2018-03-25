import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import request from 'request'
import config from '../../../../config/private'

// const fileParser = require('async-busboy')
const router = require('koa-router')()

import updateSession from '../update-session'

const app = new Koa()

function upload(ctx) {
  const { headers } = ctx

  // remove base url because current fetcher middleware add it by itself
  const endpoint = headers['x-endpoint'].replace(config.api.url, '')

  // get method
  const method = headers['x-method'] || 'post'

  const api_url = config.api.url
  const { access_token } = ctx.session.user

  return new Promise((resolve, reject) => {
    ctx.req.pipe(
      request(
        {
          uri: `${api_url}${endpoint}`,
          json: true,
          method,
          headers: {
            Authorization: `Bearer ${access_token}`,
            'User-Agent': config.app_name,
            'X-REAL-AGENT': headers['user-agent']
          }
        },
        (error, response, body) => {
          if (error) {
            return reject(error)
          }

          const { data } = body

          if (method !== 'get' && data && data.type === 'user') {
            updateSession(ctx, body)
          }

          resolve(body)
        }
      )
    )
  })
}

router.post('/proxifier/upload/:endpointKey', bodyParser(), async ctx => {
  try {
    // update user session
    ctx.body = await upload(ctx)
  } catch (e) {
    e.response = e.response || {
      status: 500,
      text: e.message
    }
    ctx.status = e.response.status
    ctx.body = e.response.text
  }
})

module.exports = app.use(router.routes())
