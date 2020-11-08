import path from 'path'

import { AxiosError } from 'axios'

import { Request, Response, NextFunction } from 'express'
import nunjucks from 'nunjucks'
import xml2js from 'xml2js'

import { request } from '../../../libs/request'

import {
  API_URL,
  DUNS,
  SHARED_SECRET,
  REQUEST_BODY_TEMPLATE
} from '../constants'

function getFormattedListingPictures(listing) {
  return listing.gallery_image_urls.map((url: string, index: number) => {
    const filename = path.basename(url, path.extname(url))

    return {
      id: filename,
      caption: `${listing.id} - ${index}`,
      filename,
      url
    }
  })
}

async function getFormattedDealMediaPictures(
  req: Request,
  res: Response,
  dealId: string
) {
  try {
    const response = await request(req, res, {
      url: `/deals/${dealId}?associations[]=deal.gallery`
    })

    const rawGalleryItems = response.data.gallery.items || []

    return rawGalleryItems.map((item, index) => {
      const url = item.file.preview_url
      const urlWithoutQuery = url.split('?')[0]
      const filename = path.basename(
        urlWithoutQuery,
        path.extname(urlWithoutQuery)
      )

      return {
        id: filename,
        caption: `${dealId} - Media - ${index}`,
        filename,
        url
      }
    })
  } catch (err) {
    console.error(
      'Error fetching deal photso for MyMarketingMatters (getFormattedDealMediaPictures):',
      err
    )

    return []
  }
}

function getListingAddressField(listing, field, defaultValue = '') {
  if (listing && listing.property && listing.property.address) {
    return listing.property.address[field] || defaultValue
  }

  return defaultValue
}

async function getRequestBody(
  req: Request,
  res: Response,
  user,
  deal,
  costCenter,
  callbackUrl
) {
  const listing = deal.listing
    ? (
        await request(req, res, {
          url: `/listings/${deal.listing.id}`,
          params: {
            associations: ['listing.proposed_agent']
          }
        })
      ).data
    : null

  const price = getPrice(deal)

  const address = getField(deal, 'street_address') || ''
  const description = listing ? listing.property.description : ''
  const dealMediaPictures = await getFormattedDealMediaPictures(
    req,
    res,
    deal.id
  )
  const pictures = listing
    ? [...getFormattedListingPictures(listing), ...dealMediaPictures]
    : dealMediaPictures

  const city = getListingAddressField(listing, 'city')
  const state = getListingAddressField(listing, 'state')
  const zip = getListingAddressField(listing, 'postal_code')

  return nunjucks
    .renderString(REQUEST_BODY_TEMPLATE, {
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
          id: getField(deal, 'mls_id') || deal.id,
          price,
          address,
          description,
          pictures,
          city,
          state,
          zip
        }
      ]
    })
    .split('’')
    .join("'") // Cause MMM API breaks with ’ character! :/
}

export default async (req: Request, res: Response, next: NextFunction) => {
  const { user, deal, costCenter, redirectUrl } = req.body

  try {
    const response = await request(req, res, {
      url: API_URL,
      headers: {
        'Content-Type': 'application/xml'
      },
      data: await getRequestBody(req, res, user, deal, costCenter, redirectUrl)
    })

    const parsedResponse = await xml2js.parseStringPromise(response.data)

    res.json({
      response: {
        url:
          parsedResponse.cXML.Response[0].PunchOutSetupResponse[0].StartPage[0]
            .URL[0]
      }
    })
  } catch (e) {
    next((e as AxiosError).response)
  }
}

/**
 * returns price of the deal's listing
 * @param deal
 */
function getPrice(deal) {
  return (
    getField(deal, 'sales_price') ||
    getField(deal, 'list_price') ||
    getField(deal, 'lease_price')
  )
}

/**
 * returns deal's context's field's value
 * @param deal
 * @param field
 */
function getField(deal, field) {
  if (!deal) {
    return null
  }

  const context =
    deal.context && deal.context[field] ? deal.context[field] : null

  if (!context) {
    return null
  }

  return context[context.data_type.toLowerCase()]
}
