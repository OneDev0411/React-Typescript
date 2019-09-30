import path from 'path'

import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import superagent from 'superagent'
import nunjucks from 'nunjucks'
import xml2js from 'xml2js'

import getListing from '../../../app/models/listings/listing/get-listing'
import { getPrice } from '../../../app/models/Deal/helpers/context/get-price'

import {
  API_URL,
  DUNS,
  SHARED_SECRET,
  REQUEST_BODY_TEMPLATE
} from './constants'

const router = require('koa-router')()
const app = new Koa()

function getRequestBody(user, deal, listing, costCenter, callbackUrl) {
  const price = getPrice(deal)

  return nunjucks.renderString(REQUEST_BODY_TEMPLATE, {
    duns: DUNS,
    networkUserIdSharedSecret: SHARED_SECRET,
    callbackUrl,
    user: {
      costCenter,
      id: user.id,
      email: user.email,
      uniqueName: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    },
    properties: [
      {
        id: listing.id,
        price,
        address: listing.property.address.full_address,
        description: listing.property.description,
        pictures: listing.gallery_image_urls.map((url, index) => {
          const filename = path.basename(url, path.extname(url))

          return {
            id: filename,
            caption: `${listing.id} - ${index}`,
            filename,
            url
          }
        })
      }
    ]
  })
}

async function sendPunchoutRequest(user, deal, costCenter, callbackUrl) {
  const listing = await getListing(deal.listing)

  const requestBody = getRequestBody(
    user,
    deal,
    listing,
    costCenter,
    callbackUrl
  )

  const response = await superagent
    .post(API_URL)
    .set('Content-Type', 'application/xml')
    .send(requestBody)

  return response
}

router.post('/my-marketing-matters/punchout', bodyParser(), async ctx => {
  const { user: userSession } = ctx.session

  if (!userSession) {
    ctx.status = 401
    ctx.body = 'Unauthorized'

    return
  }

  try {
    const { user, deal, costCenter, redirectUrl } = ctx.request.body
    const punchoutResponse = await sendPunchoutRequest(
      user,
      deal,
      costCenter,
      redirectUrl
    )
    const parsedResponse = await xml2js.parseStringPromise(
      punchoutResponse.text
    )

    const response = {
      url:
        parsedResponse.cXML.Response[0].PunchOutSetupResponse[0].StartPage[0]
          .URL[0]
    }

    ctx.status = 200
    ctx.body = {
      response
    }
  } catch (err) {
    ctx.status = 500
    ctx.body = {
      error: err
    }
  }
})

module.exports = app.use(router.routes())
