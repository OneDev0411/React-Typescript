import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import { PassThrough } from 'stream'
import FakeStream from '../../../util/fake-stream'

const router = require('koa-router')()

import updateSession from '../update-session'
import config from '../../../../config/private'

const app = new Koa()

/**
 * returns error object if possible
 * @param {String} text - the error text
 */
const handleErrorObject = text => {
  if (!text) {
    return {}
  }

  try {
    return JSON.parse(text)
  } catch (e) {
    return { text }
  }
}

router.post(
  '/proxifier/:endpointKey',
  bodyParser({
    jsonLimit: '10mb'
  }),
  async ctx => {
    const headers = ctx.headers
    const queryString = ctx.request.querystring

    const shouldStream = headers['x-stream'] === 'true'

    let fakeInterval
    let fakeStream

    /**
     * finishes a request
     * @param {Object} data - the response object
     */
    const finishStream = data => {
      clearInterval(fakeInterval)
      fakeStream.push(JSON.stringify(data))
      fakeStream.emit('end')
    }

    if (shouldStream) {
      fakeStream = new FakeStream()
      fakeInterval = setInterval(() => fakeStream.push('\n'), 1500)

      ctx.body = fakeStream.pipe(PassThrough())
    }

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

      if (shouldStream) {
        return finishStream({
          success: true,
          ...response.body
        })
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
      ctx.body = {
        statusCode: status,
        ...handleErrorObject(text)
      }
    }
  }
)

module.exports = app.use(router.routes())
