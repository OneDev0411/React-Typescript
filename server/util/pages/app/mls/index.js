import Koa from 'koa'
import listing_util from '../../../../../app/utils/listing'
import getListing from '../../../../../app/models/listings/listing/get-listing'

const router = require('koa-router')()
const app = new Koa()

/**
 * route for /mls/alerts
 */
router.get('/dashboard/mls/alerts/:id?', async (ctx, next) => {
  if (!ctx.session.user) {
    const path = ctx.request.path
    return ctx.redirect(`/signin?redirect_to=${path}`)
  }

  await next()
})

/**
 * route for /mls/alerts/actives
 */
router.get('/dashboard/mls/actives', async (ctx, next) => {
  if (!ctx.session.user) {
    const path = ctx.request.path
    return ctx.redirect(`/signin?redirect_to=${path}`)
  }

  await next()
})

/**
 * route for /mls/:id
 */
router.get('/dashboard/mls/:id', async (ctx, next) => {
  const { id } = ctx.params

  const isListingPage = url =>
    new RegExp(
      /^\/dashboard\/mls\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
    ).test(url)

  if (!id || typeof id === 'undefined' || !isListingPage(ctx.url)) {
    return await next()
  }

  try {
    const listing = await getListing(id)

    const openGraphData = {
      has_og: true,
      og_image_url: listing.cover_image_url,
      og_description: listing.property.description,
      og_title: listing_util.addressTitle(listing.property.address),
      og_url: `${ctx.request.protocol}://${ctx.request.hostname}${ctx.request
        .url}`
    }

    ctx.locals = {
      ...ctx.locals,
      ...openGraphData
    }

    if (ctx.session.user && ctx.request.query.token) {
      ctx.session = null
    }
  } catch (e) {}

  await next()
})

module.exports = app.use(router.routes())
