import Koa from 'koa'
import AppStore from '../../../../../app/stores/AppStore'
import Listing from '../../../../../app/models/Listing'
import listing_util from '../../../../../app/utils/listing'
const router = require('koa-router')()
const app = new Koa()

async function getListing(config, id){
  return new Promise((resolve, reject) => {
    Listing.get({
      id,
      api_host: config.api_host_local
    }, (err, response) => {
      if (err) {
        return reject(err)
      }

      return resolve(response)
    })
  })
}

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
  AppStore.data.user = ctx.session.user
  ctx.locals.AppStore = JSON.stringify(AppStore)
  await ctx.display()
})

/**
 * route for /mls/:id
 */
router.get('/dashboard/mls/:id', async (ctx, next) => {
  const id = ctx.params.id

  if (!id) {
    return await next()
  }

  try {
    const response = await getListing(ctx.config, id)
    const listing = response.data

    AppStore.data.current_listing = listing
    ctx.locals.has_og = true
    ctx.locals.og_title = listing_util.addressTitle(listing.property.address)
    ctx.locals.og_url = ctx.request.protocol + '://' + ctx.request.hostname + ctx.request.url
    ctx.locals.og_description = listing.property.description
    ctx.locals.og_image_url = listing.cover_image_url
    ctx.locals.AppStore = JSON.stringify(AppStore)

    if (ctx.session.user && ctx.request.query.token) {
      ctx.session = null
    }
  }
  catch(e) {

  }

  await next()
})

module.exports = app.use(router.routes())
