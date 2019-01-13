import Koa from 'koa'
import cheerio from 'cheerio'

import config from '../../../../../config/public'
import getUserProfile from '../../../../../app/models/user/get-self'

import storage from './storage'
import { getRegisterationScript } from './inject'
import { offlineSubmitHandler, onlineSubmitHandler } from './handlers'
import { LOCAL_STORAGE_REGISTERATION_KEY } from './constants'

const router = require('koa-router')()
const app = new Koa()
const API_URL = config.api_url

router.get('/openhouse/:id/:brand/register', async ctx => {
  const { user } = ctx.session

  if (!user) {
    ctx.redirect(`/signin?redirectTo=${ctx.request.href}`)

    return false
  }

  const { id: agentUserId } = await getUserProfile(user.access_token)
  const brandId = ctx.params.brand
  let openHouse

  try {
    const response = await ctx
      .fetch(`/crm/tasks/${ctx.params.id}`, 'GET')
      .set('Authorization', `Bearer ${user.access_token}`)
      .set('X-RECHAT-BRAND', brandId)

    openHouse = response.body.data
  } catch (e) {
    console.log(e)

    ctx.body = e.response.body.message
    ctx.status = e.response.statusCode

    return false
  }

  // get template
  const template = openHouse.metadata.template
    .split('readonly')
    .join('required')

  const $ = cheerio.load(template)

  const openHouseId = openHouse.id
  const openHouseTitle = openHouse.title
  const agentAccessToken = user.access_token

  $('head').append(
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css" />'
  )
  $('body').append(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js" />'
  )

  $('body').append(
    getRegisterationScript({
      API_URL,
      LOCAL_STORAGE_REGISTERATION_KEY,
      openHouseId,
      openHouseTitle,
      agentAccessToken,
      agentUserId,
      brandId,
      onlineSubmitHandler,
      offlineSubmitHandler,
      storage
    })
  )

  ctx.body = $.html()
})

module.exports = app.use(router.routes())
