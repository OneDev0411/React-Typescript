import Koa from 'koa'
import mount from 'koa-mount'
import url from 'url'
import config from '../../../config/private'
import handle490 from './490.js'
import Brand from '../../../app/models/Brand'

const _ = require('underscore')

const app = new Koa()

async function getBrand(user) {
  return new Promise((resolve, reject) => {
    const hostname = 'katie.app.claystapp.com'//url.parse(config.app_url).hostname

    Brand.getByHostname({ hostname, user }, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}

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

app.use(handle490)

app.use(async function(ctx, next) {
  ctx.config = config
  const { AppStore } = ctx.locals
  const { user } = AppStore.data

  if (!ctx.session.user){
    delete AppStore.data.user
  } else {
    AppStore.data = {
      ...AppStore.data,
      ...{
        user: ctx.session.user
      }
    }
  }

  try {
    if (!AppStore.data.brand_checked) {
      const response = await getBrand(user)
      AppStore.data = {
        ...AppStore.data,
        ...{
          brand: response.body.data
        }
      }
    }
  } catch(e) {
    /* nothing */
  } finally {
    AppStore.data.brand_checked = true
  }

  ctx.locals.AppStore = AppStore

  await next()
})

_.each(routes, (group, name) => {
  _.each(group, rt => {
    app.use(mount(require(`./${name}/${rt[0]}`)))
  })
})

module.exports = app
