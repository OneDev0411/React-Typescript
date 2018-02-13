import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/deals/excel/:brandId', async ctx => {
  try {
    const { user } = ctx.session
    const { brandId } = ctx.params

    if (!user) {
      ctx.status = 404

      return false
    }

    ctx.set('Content-Disposition', 'attachment')
    ctx.attachment('deals.xls')

    const response = ctx
      .fetch(`/brands/${brandId}/deals.xls`)
      .set('Authorization', `Bearer ${ctx.session.user.access_token}`)

    ctx.body = response
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
