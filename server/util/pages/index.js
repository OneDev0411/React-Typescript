import Koa from 'koa'
import mount from 'koa-mount'
import MobileDetect from 'mobile-detect'
import _ from 'underscore'

const app = new Koa()

app.use(async (ctx, next) => {
  if (ctx.path === '/unsupported') {
    return next()
  }

  const ua = ctx.get('user-agent')
  const isIE = ua.indexOf('MSIE ') >= 0 || ua.indexOf('Trident/') >= 0

  if (isIE) {
    return ctx.redirect('/unsupported')
  }

  return next()
})

app.use(async (ctx, next) => {
  const isMobile = new MobileDetect(ctx.req.headers['user-agent'])

  const isDashboard = url => url.toLowerCase().indexOf('dashboard') !== -1

  const isListingPage = url =>
    new RegExp(
      /^\/dashboard\/mls\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/
    ).test(url)

  const isMarketingWizardPage = url =>
    url.startsWith('/dashboard/marketing/wizard')

  if (
    !isDashboard(ctx.url) ||
    (isDashboard(ctx.url) && isListingPage(ctx.url)) ||
    (isDashboard(ctx.url) && isMarketingWizardPage(ctx.url))
  ) {
    // eslint-disable-next-line
    return next()
  }

  if (isMobile.phone()) {
    let url = '/mobile'

    if (isMobile.is('iPhone')) {
      url = '/mobile?type=iphone'
    }

    return ctx.redirect(url)
  }

  // eslint-disable-next-line
  return next()
})

const routes = {
  app: ['signout', 'reset_password', 'listing'],
  openhouse: ['registration'],
  others: ['unsupported']
}

_.each(routes, (group, name) => {
  _.each(group, route => {
    // eslint-disable-next-line
    app.use(mount(require(`./${name}/${route}`)))
  })
})

export default app
