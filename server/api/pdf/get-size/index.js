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

    let totalSize = 0
    const url = `${config.forms.url}/${id}.pdf`

    try {
      const response = await agent.head(url)

      totalSize = ~~response.headers['content-length']
    } catch (e) {
      /* nothing */
    }

    ctx.body = {
      total: totalSize
    }
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
