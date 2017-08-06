import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import _ from 'underscore'
const router = require('koa-router')()
import updateSession from '../update-session'
import config from '../../../../config/private'

const app = new Koa()

router.post('/proxifier', bodyParser(), async ctx => {
  const headers = ctx.headers
  const queryString = ctx.request.querystring

  try {
    // get brand
    const brand = headers['x-rechat-brand']

    // remove base_url because current fetcher middleware add it by itself
    let endpoint = headers['x-endpoint'].replace(config.api.url, '')

    if (queryString) {
      endpoint += `?${queryString}`
    }

    // get method
    const method = headers['x-method']

    const request = ctx
      .fetch(endpoint, method)
      .send(ctx.request.body)

    if (headers.authorization) {
      request.set({ Authorization: headers.authorization })
    }

    if (brand) {
      request.set('X-RECHAT-BRAND', brand)
    }

    const response = await request

    // update user session
    const { data } = response.body
    
    if (data) {
        console.log(data.type)
        if (data.type === 'user') { console.log(data) }
    }
    
    if (data && data.type === 'user') {
      updateSession(ctx, data)
    }

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
