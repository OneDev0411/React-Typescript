import cheerio from 'cheerio'
import { Request, Response, NextFunction } from 'express'

import config from '../../../../config'
import type { Session } from '../../../../types'
import { request } from '../../../libs/request'
import { getParsedHeaders } from '../../../utils/parse-headers'

import { LOCAL_STORAGE_REGISTERATION_KEY } from './constants'
import { offlineSubmitHandler, onlineSubmitHandler } from './handlers'
import { getRegisterationScript } from './inject'
import storage from './storage'

export default async (
  req: Request & {
    session: Session
  },
  res: Response,
  next: NextFunction
) => {
  const { user } = req.session

  if (!user) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`

    res.redirect(`/signin?redirectTo=${fullUrl}`)

    return false
  }

  const { data: profile } = await request(req, {
    headers: getParsedHeaders(req),
    url: '/users/self'
  })

  const agentUserId = profile.data.id

  const brandId = req.params.brand
  let openHouse

  try {
    const response = await request(req, {
      url: `/crm/tasks/${req.params.id}`,
      headers: {
        ...getParsedHeaders(req),
        'X-RECHAT-BRAND': brandId
      }
    })

    openHouse = response.data.data
  } catch (e) {
    res.status(e.response?.status)
    res.send(e.response?.data)

    return false
  }

  // get template
  const template = openHouse.metadata.template.split('disabled').join('')

  const $ = cheerio.load(template)

  const openHouseId = openHouse.id
  const openHouseTitle = openHouse.title
  const agentAccessToken = user.access_token

  $('head').append(
    `<link rel="stylesheet" 
    href="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.css" />
    <link rel="apple-touch-icon" 
      sizes="180x180" 
      href="/static/images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32"
      href="/static/images/favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16"
      href="/static/images/favicons/favicon-16x16.png">
    <link rel="manifest" href="/static/images/favicons/manifest.json">
    <link rel="mask-icon"
      href="/static/images/favicons/safari-pinned-tab.svg" color="#0945eb">
    <link rel="shortcut icon" href="/static/images/favicons/favicon.ico">
    <meta
      name="msapplication-config"
      content="/static/images/favicons/browserconfig.xml">
    <meta name="theme-color" content="#fff">`
  )
  $('body').append(
    '<script src="https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.min.js" />'
  )

  $('body').append(
    getRegisterationScript({
      API_URL: config.api_url,
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

  res.send($.html())
}
