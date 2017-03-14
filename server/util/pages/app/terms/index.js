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
  ctx.title = page.title
  ctx.content = page.content

  return ctx.render('legal')
})

// mls terms
router.get('/terms/mls', async (ctx, next) => {

  const page = await getPage(ctx.config, 'mls-terms')
  ctx.title = page.title
  ctx.content = page.content

  return ctx.render('legal')
})

// privacy
router.get('/privacy', async (ctx, next) => {

  const page = await getPage(ctx.config, 'privacy')
  ctx.title = page.title
  ctx.content = page.content

  return ctx.render('legal')
})

module.exports = app.use(router.routes())
