import Koa from 'koa'
import mount from 'koa-mount'
const _ = require('underscore')

const app = new Koa()

const routes = {
  app: [
    [ 'home' ],
    [ 'signin' ],
    [ 'signout' ]
  ]
}

_.each(routes, (group, name) => {
  _.each(group, rt => {
    app.use(mount(require(`./${name}/${rt[0]}`)))
  })
})

module.exports = app
