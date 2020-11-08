import Koa from 'koa'

import { createUrlSearch } from '../../../../../app/utils/helpers'

const router = require('koa-router')()
const app = new Koa()

router.get('/signout', async ctx => {
  ctx.session = null

  const { querystring } = ctx.request
  const { redirectFromSignout, redirect_to, ...queryParams } = ctx.request.query
  let redirect = redirectFromSignout || redirect_to || '/signin'

  if (querystring) {
    redirect += createUrlSearch(queryParams, undefined, true)
  }

  ctx.redirect(redirect)
})

module.exports = app.use(router.routes())
