import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
const router = require('koa-router')()

import config from '../../../../config/private'

const app = new Koa()

const serialize = obj => {
  const str = []
  Object.keys(obj).forEach(key => {
    str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
  })
  return str.join('&')
}

router.post('/proxifier', bodyParser(), async ctx => {
  const headers = ctx.headers
  const data = ctx.request.body
  const queryString = serialize(ctx.query)

  try {
    // remove base_url because current fetcher middleware add it by itself
    let endpoint = headers['x-endpoint'].replace(config.api.url, '')

    if (queryString) {
      endpoint += `?${queryString}`
    }

    // get method
    const method = headers['x-method']

    const request = ctx.fetch(endpoint, method).send(data)

    if (headers.authorization) {
      request.set({ Authorization: headers.authorization })
    }

    const response = await request

    ctx.body = response.body
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
