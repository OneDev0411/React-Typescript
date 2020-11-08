import { PassThrough } from 'stream'

import Koa from 'koa'
import Router from 'koa-router'
import superagent from 'superagent'

const router = new Router()
const app = new Koa()

router.get('/utils/cors/:url(.+)', async ctx => {
  const url: string = ctx.params.url
  const urlWithQueryString = ctx.querystring ? `${url}?${ctx.querystring}` : url

  ctx.body = superagent
    .get(urlWithQueryString)
    .on('error', ctx.onerror)
    .pipe(new PassThrough())
})

module.exports = app.use(router.routes())
