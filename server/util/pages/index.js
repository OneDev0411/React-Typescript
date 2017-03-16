import Koa from 'koa'
import mount from 'koa-mount'
import config from '../../../config/private'
import AppStore from '../../../app/stores/AppStore'
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
    [ 'recent' ],
    [ 'dashboard' ],
    [ 'widget' ],
    [ 'invite' ],
    [ 'reset-password' ]
  ],
  verify: [
    [ 'email' ],
    [ 'activate' ],
    [ 'phone' ]
  ]
}

app.use(async function(ctx, next) {
  ctx.config = config

  if(!ctx.session.user){
    delete AppStore.data.user
  } else {
    AppStore.data.user = ctx.session.user
    ctx.locals.AppStore = JSON.stringify(AppStore)
  }

  await next()
})

_.each(routes, (group, name) => {
  _.each(group, rt => {
    app.use(mount(require(`./${name}/${rt[0]}`)))
  })
})

module.exports = app
