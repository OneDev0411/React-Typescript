import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import _ from 'underscore'

const router = require('koa-router')()

import updateSession from '../update-session'
import config from '../../../../config/private'

const app = new Koa()

router.post('/proxifier/:endpoint', bodyParser(), async ctx => {
  const headers = ctx.headers
  const queryString = ctx.request.querystring

  try {
    let request
    const brand = headers['x-rechat-brand']
    const authMode = headers['x-auth-mode']

    // remove base_url because current fetcher middleware add it by itself
    let endpoint = headers['x-endpoint'].replace(config.api.url, '')

    if (queryString) {
      endpoint += `?${queryString}`
    }

    // get method
    const method = headers['x-method']

    if (authMode === 'client_id') {
      const requestBody = {
        ...ctx.request.body,
        client_id: config.api.client_id,
        client_secret: config.api.client_secret
      }

      request = ctx.fetch(endpoint, method).send(requestBody)
    } else {
      request = ctx.fetch(endpoint, method)

      if (method.toLowerCase() !== 'get') {
        request.send(ctx.request.body)
      }
    }

    if (headers.authorization) {
      request.set({ Authorization: headers.authorization })
    }

    if (brand) {
      request.set('X-RECHAT-BRAND', brand)
    }

    const response = await request
    // update user session
    const { data } = response.body

    if (method !== 'get' && data && data.type === 'user') {
      updateSession(ctx, response.body)
    }

    ctx.body = {
      ...response.body,
      statusCode: response.statusCode
    }
  } catch (e) {
    e.response = e.response || {
      status: 500,
      text: e.message
    }

    const { status, text } = e.response

    ctx.status = status

    try {
      ctx.body = {
        statusCode: status,
        ...JSON.parse(text)
      }
    } catch (error) {
      ctx.body = {
        text,
        statusCode: status
      }
    }
  }
})

module.exports = app.use(router.routes())
