import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import config from '../../../../config/private'
import { logger } from '../../../util/logger'

const router = require('koa-router')()

const app = new Koa()

app.use(logger)

router.post('/proxifier', bodyParser(), async ctx => {
  const headers = ctx.headers
  const { querystring } = ctx.request

  ctx.log('Proxifier:::Start')

  try {
    const brand = headers['x-rechat-brand']
    const method = headers['x-method']
    const authorization = headers.authorization
    const isGetMethod = method.toLowerCase() === 'get'

    // remove base_url because current fetcher middleware add it by itself
    let endpoint = headers['x-endpoint'].replace(config.api.url, '')

    if (querystring) {
      endpoint += `?${querystring}`
    }

    const requestBody = headers['x-auth-mode']
      ? {
          ...ctx.request.body,
          client_id: config.api.client_id,
          client_secret: config.api.client_secret
        }
      : {}

    const request = isGetMethod
      ? ctx.fetch(endpoint, method) // bug alert: on Get method it shouldn't send body
      : ctx.fetch(endpoint, method).send(requestBody)

    if (authorization) {
      request.set({ Authorization: authorization })
    }

    if (brand) {
      request.set({ 'X-RECHAT-BRAND': brand })
    }

    const response = await request

    if (headers['x-auth-mode'] && response.body.access_token) {
      ctx.session.user = {
        access_token: response.body.access_token,
        refresh_token: response.body.refresh_token,
        expire_date: new Date().getTime() + response.body.expires_in * 1000
      }
    }

    ctx.status = response.statusCode
    ctx.body = response.body
  } catch (e) {
    e.response = e.response || {
      status: 500,
      text: e.message
    }

    const { status, text } = e.response

    ctx.status = status
    ctx.body = text
  }

  ctx.log('Proxifier:::End')
})

module.exports = app.use(router.routes())
