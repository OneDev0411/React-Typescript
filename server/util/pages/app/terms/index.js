import Koa from 'koa'
import Cosmic from 'cosmicjs'
const router = require('koa-router')()
const app = new Koa()

async function getPage(config, slug) {
  return new Promise(resolve => {
    Cosmic.getObject(config.cosmicjs, { slug }, (err, response) => {
      resolve(response.object)
    })
  })
}

// terms
router.get('/terms', async (ctx, next) => {

  const page = await getPage(ctx.config, 'terms-of-service')
  ctx.locals.title = page.title
  ctx.locals.content = page.content

  await ctx.display('legal')
})

// mls terms
router.get('/terms/mls', async (ctx, next) => {

  const page = await getPage(ctx.config, 'mls-terms')
  ctx.locals.title = page.title
  ctx.locals.content = page.content

  await ctx.display('legal')
})

// privacy
router.get('/privacy', async (ctx, next) => {

  const page = await getPage(ctx.config, 'privacy')
  ctx.locals.title = page.title
  ctx.locals.content = page.content

  await ctx.display('legal')
})

module.exports = app.use(router.routes())
