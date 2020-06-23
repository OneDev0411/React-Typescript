import Koa from 'koa'
import Router from 'koa-router'
import superagent from 'superagent'

const router = new Router()
const app = new Koa()

router.get('/utils/cors/:url(.+)', async ctx => {
  const url: string = ctx.params.url
  const urlWithQueryString = ctx.querystring ? `${url}?${ctx.querystring}` : url

  const response = await superagent.get(urlWithQueryString).send()

  ctx.body = response.body
  ctx.status = response.status
  ctx.set(response.header)
})

module.exports = app.use(router.routes())
