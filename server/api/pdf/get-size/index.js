import Koa from 'koa'
import agent from 'superagent'
import config from '../../../../config/public'

const router = require('koa-router')()

const app = new Koa()

router.get('/pdf/get-size/:id', async ctx => {
  try {
    const { user } = ctx.session
    const { id } = ctx.params

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    const url = `${config.forms.url}/${id}.pdf`
    const response = await agent.head(url)

    ctx.body = {
      total: response.headers['content-length']
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
