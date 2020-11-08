import Koa from 'koa'
import agent from 'superagent'
import bodyParser from 'koa-bodyparser'

import config from '../../../../config/public'

const router = require('koa-router')()

const app = new Koa()

router.post('/pdf/get-size', bodyParser(), async ctx => {
  try {
    const { user } = ctx.session
    const { form, pdfUrl } = ctx.request.body

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    let totalSize = 0
    const url = pdfUrl || `${config.forms.url}/${form}.pdf`

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
