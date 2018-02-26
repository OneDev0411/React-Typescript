import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/export/*', async ctx => {
  try {
    const { user } = ctx.session
    const url = `/${ctx.params[0]}`
    const { fileName } = ctx.query

    if (!user) {
      ctx.throw(401, 'Unauthorized')
    }

    ctx.set('Content-Disposition', 'attachment')
    ctx.attachment(fileName)

    const response = ctx
      .fetch(url)
      .set('Authorization', `Bearer ${ctx.session.user.access_token}`)

    ctx.body = response
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
