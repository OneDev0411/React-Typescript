import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

router.get('/deals/docusign/login', async ctx => {
  try {
    await ctx.fetch('/users/self/docusign/auth').redirects(0)
  } catch (e) {
    if (e.status === 302) {
      const link = e.response.text.match(urlPattern).map(url => url.trim())

      ctx.redirect(link)
    }
  }
})

module.exports = app.use(router.routes())
