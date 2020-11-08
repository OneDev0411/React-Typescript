import Koa from 'koa'

import config from '../../../../../config/public'
import listing_util from '../../../../../app/utils/listing'
import getListing from '../../../../../app/models/listings/listing/get-listing'
import { isUUID } from '../../../../../app/utils/validations/is-uuid/is-uuid.ts'
import { getBrandByHostname } from '../../../../../app/models/brand/get-brand-by-hostname'

const router = require('koa-router')()
const app = new Koa()

/**
 * route for /mls/:id
 */
router.get('/dashboard/mls/:id', async (ctx, next) => {
  const { id } = ctx.params

  if (!id || !isUUID(id)) {
    return next()
  }

  try {
    const brand = await getBrandByHostname(ctx.hostname)

    const listing = await getListing(id, brand && brand.id)

    ctx.state.openGraph = {
      has_og: true,
      app_id: config.fb.app_id,
      og_image_url: listing.cover_image_url,
      og_description: listing.property.description,
      og_title: listing_util.addressTitle(listing.property.address),
      og_url: `${ctx.request.protocol}://${ctx.request.hostname}${
        ctx.request.url
      }`
    }

    if (ctx.session.user && ctx.request.query.token) {
      ctx.session = null
    }
  } catch (error) {
    console.log('Listing Not Found!', error)
  }

  return next()
})

module.exports = app.use(router.routes())
