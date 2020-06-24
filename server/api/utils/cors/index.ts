import Koa from 'koa'
import Router from 'koa-router'
import superagent from 'superagent'

const router = new Router()
const app = new Koa()

router.get('/utils/cors/:url(.+)', async ctx => {
  const { user } = ctx.session

  if (!user) {
    ctx.status = 401
    ctx.body = 'Unauthorized'

    return
  }

  const url: string = ctx.params.url
  const urlWithQueryString = ctx.querystring ? `${url}?${ctx.querystring}` : url

  const response = await superagent.get(urlWithQueryString).send()

  ctx.set(response.header)
  ctx.status = response.status
  ctx.body = response.body
})

module.exports = app.use(router.routes())
