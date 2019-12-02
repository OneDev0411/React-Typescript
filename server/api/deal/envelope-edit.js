import Koa from 'koa'
import agent from 'superagent'

import config from '../../../config/public'

const router = require('koa-router')()
const app = new Koa()

const urlPattern = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi

router.get('/deals/envelope/:id/edit', async ctx => {
  const { user } = ctx.session
  const { id } = ctx.params

  if (!user) {
    ctx.status = 401
    ctx.body = 'Unauthorized'

    return
  }

  try {
    await agent
      .get(`${config.api_url}/envelopes/${id}/edit`)
      .set('Authorization', `Bearer ${user.access_token}`)
      .redirects(0)

    ctx.body = ''
  } catch (e) {
    if (e.status === 302) {
      const link = e.response.text.match(urlPattern).map(url => url.trim())

      ctx.redirect(link)
    }

    if (e.status === 400 || e.status === 401) {
      ctx.body =
        '<html lang="en"><body><h3>Access denied. This envelope was created by someone else. You cannot amend it.</h3></body></html>'
    }
  }
})

module.exports = app.use(router.routes())
