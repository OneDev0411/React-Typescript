import Koa from 'koa'

const router = require('koa-router')()
const PassThrough = require('stream').PassThrough
const app = new Koa()

router.get('/contacts/export/outlook', async ctx => {
  try {
    const { user } = ctx.session

    if (!user) {
      ctx.status = 401
      ctx.body = 'Unauthorized'

      return
    }

    ctx.body = ctx
      .fetch(`/contacts/outlook.csv?${ctx.querystring}`)
      .set('Authorization', `Bearer ${user.access_token}`)
      .on('response', res => {
        ctx.set('Content-Disposition', res.headers['content-disposition'])
      })
      .pipe(PassThrough())
  } catch (e) {
    console.log(e)
  }
})

module.exports = app.use(router.routes())
