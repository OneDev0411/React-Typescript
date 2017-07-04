import Koa from 'koa'
import Listing from '../../../../../app/models/Listing'
import listing_util from '../../../../../app/utils/listing'
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
 * route for /mls
 */
router.get('/dashboard/mls', async (ctx, next) => {
  await next()
})

/**
 * route for /mls/:id
 */
router.get('/dashboard/mls/:id', async (ctx, next) => {
  const id = ctx.params.id

  if (!id || id === 'undefined') {
    return await next()
  }

  try {
    const { AppStore } = ctx.locals

    const access_token = AppStore.data.user ? AppStore.data.user.access_token : null
    const brand = AppStore.data.brand

    const response = await Listing.fetch(id, brand, access_token)
    const listing = response.body.data

    AppStore.data = {
      ...AppStore.data,
      ...{
        current_listing: listing
      }
    }

    const locals = {
      has_og: true,
      og_title: listing_util.addressTitle(listing.property.address),
      og_url: `${ctx.request.protocol}://${ctx.request.hostname}${ctx.request.url}`,
      og_description: listing.property.description,
      og_image_url: listing.cover_image_url
    }

    ctx.locals = {
      ...ctx.locals,
      ...locals,
      ...{AppStore}
    }

    if (ctx.session.user && ctx.request.query.token) {
      ctx.session = null
    }
  }
  catch(e) {}

  await next()
})

module.exports = app.use(router.routes())
