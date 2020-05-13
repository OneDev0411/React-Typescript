import Koa from 'koa'
import mjml2html from 'mjml'
import bodyParser from 'koa-bodyparser'

const router = require('koa-router')()
const app = new Koa()

router.post('/utils/render-mjml', bodyParser(), ctx => {
  const { mjml } = ctx.request.body

  try {
    const response = mjml2html(mjml)

    ctx.status = 200
    ctx.body = response
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      error
    }
  }
})

module.exports = app.use(router.routes())
