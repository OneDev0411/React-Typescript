import Koa from 'koa'

const router = require('koa-router')()
const app = new Koa()

router.get('/', async ctx =>
  ctx.render('_website/index.ejs', { title: 'Rechat' })
)

router.get('/faq', async ctx =>
  ctx.render('_website/faq.ejs', { title: 'FAQ | Rechat' })
)

router.get('/contact', async ctx =>
  ctx.render('_website/contact.ejs', { title: 'Learn More | Rechat' })
)

router.get('/about', async ctx =>
  ctx.render('_website/about.ejs', { title: 'About | Rechat' })
)

router.get('/terms', async ctx =>
  ctx.render('_website/terms.ejs', { title: 'Terms of Use | Rechat' })
)

router.get('/terms/mls', async ctx =>
  ctx.render('_website/mlsTerms.ejs', { title: 'MLS® Terms | Rechat' })
)

router.get('/privacy', async ctx =>
  ctx.render('_website/privacy.ejs', {
    title: 'Privacy Policy | Rechat'
  })
)

module.exports = router.routes()
