import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

router.get('/deals/envelope/:id/sign/:recipientId', async ctx => {
  const { id, recipientId } = ctx.params

  try {
    await ctx.fetch(`/envelopes/${id}/sign/${recipientId}`).redirects(0)

    ctx.body = ''
  } catch (e) {
    if (e.status === 302) {
      const link = e.response.text.match(urlPattern).map(url => url.trim())

      ctx.redirect(link)
    }
  }
})

module.exports = app.use(router.routes())
