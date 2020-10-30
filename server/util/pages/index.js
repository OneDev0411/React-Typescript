import Koa from 'koa'
import mount from 'koa-mount'
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
