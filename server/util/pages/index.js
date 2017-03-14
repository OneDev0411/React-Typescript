import Koa from 'koa'
import mount from 'koa-mount'
import config from '../../../config/private'
const _ = require('underscore')

const app = new Koa()

const routes = {
  app: [
    [ 'home' ],
    [ 'signin' ],
    [ 'signup' ],
    [ 'signout' ],
    [ 'terms' ],
    [ 'mls' ],
    [ 'recent' ]
  ]
}

app.use(async function(ctx, next) {
  ctx.config = config
  await next()
})

_.each(routes, (group, name) => {
  _.each(group, rt => {
    app.use(mount(require(`./${name}/${rt[0]}`)))
  })
})

module.exports = app
