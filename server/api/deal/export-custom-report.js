import Koa from 'koa'
import moment from 'moment'

const router = require('koa-router')()
const PassThrough = require('stream').PassThrough
const app = new Koa()

router.get('/deals/report/:data', async ctx => {
  try {
    const { user } = ctx.session
    const { data } = ctx.params
    const convertedData = JSON.parse(decodeURIComponent(data))

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    const fileName = `Rechat ${convertedData.title} ${moment().format(
      'MM-DD-YY'
    )}`

    ctx.set('Content-Disposition', `attachment; filename=${fileName}.csv`)

    ctx.body = ctx
      .fetch(
        `/analytics/deals/facts?order=${convertedData.order}&format=csv`,
        'POST'
      )
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('X-RECHAT-BRAND', convertedData.brand)
      .send({ filter: convertedData.filter, project: convertedData.project })
      .pipe(PassThrough())
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
