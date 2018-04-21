import Koa from 'koa'

const router = require('koa-router')()
const PassThrough = require('stream').PassThrough
const app = new Koa()

router.get('/deals/export/:id', async ctx => {
  try {
    const { user } = ctx.session
    const { id } = ctx.params

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    ctx.set('Content-Disposition', 'attachment; filename=deals.xlsx')

    ctx.body = ctx
      .fetch(`/brands/${id}/deals.xlsx`)
      .set('Authorization', `Bearer ${user.access_token}`)
      .pipe(PassThrough())
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
