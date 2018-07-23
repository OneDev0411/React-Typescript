import Koa from 'koa'

const router = require('koa-router')()
const PassThrough = require('stream').PassThrough
const app = new Koa()

router.get('/deals/report/:data', async ctx => {
  try {
    const { user } = ctx.session
    const { data } = ctx.params
    const convertedData = JSON.parse(Buffer.from(data, 'base64'))

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    ctx.set('Content-Disposition', 'attachment; filename=deals.csv')

    ctx.body = ctx
      .fetch(
        `/analytics/deals/facts?order=${convertedData.order}&format=csv`,
        'POST'
      )
      .set('Authorization', `Bearer ${user.access_token}`)
      .send({ filter: convertedData.filter, project: convertedData.project })
      .on('response', res => {
        ctx.set('Content-Disposition', res.headers['content-disposition'])
      })
      .pipe(PassThrough())
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
