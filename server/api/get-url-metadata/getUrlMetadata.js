import Koa from 'koa'
import bodyParser from 'koa-bodyparser'

import { getUrlMetadata } from './get-url-metadata'

const router = require('koa-router')()
const app = new Koa()

router.post('/get-url-metadata/getUrlMetadata', bodyParser(), async ctx => {
  const { url } = ctx.request.body

  try {
    const metadata = await getUrlMetadata(url)

    ctx.status = 200
    ctx.body = {
      response: metadata
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      error
    }
  }
})

module.exports = app.use(router.routes())
