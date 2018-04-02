import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

router.get('/deals/envelope/:id/edit', async (ctx, next) => {
  const { id } = ctx.params

  try {
    await ctx.fetch(`/envelopes/${id}/edit`).redirects(0)

    ctx.body = ''
  } catch (e) {
    if (e.status === 302) {
      const link = e.response.text.match(urlPattern)

      ctx.redirect(link)
    }
  }
})

module.exports = app.use(router.routes())
