import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import _ from 'underscore'

const fileParser = require('async-busboy')
const router = require('koa-router')()

import updateSession from '../update-session'
import config from '../../../../config/private'

const app = new Koa()

router.post('/proxifier/upload/:endpointKey', bodyParser(), async ctx => {
  const headers = ctx.headers
  const { files, fields } = await fileParser(ctx.req)

  try {
    // remove base url because current fetcher middleware add it by itself
    const endpoint = headers['x-endpoint'].replace(config.api.url, '')

    // get method
    const method = headers['x-method'] || 'post'

    const request = ctx.fetch(endpoint, method, 'multipart/form-data')

    _.each(files, file => {
      request.attach(file.filename, file.path, file.filename)
    })

    if (headers.authorization) {
      request.set({ Authorization: headers.authorization })
    }

    const response = await request

    // update user session
    const { data } = response.body

    if (method !== 'get' && data && data.type === 'user') {
      updateSession(ctx, response.body)
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
