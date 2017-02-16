const _ = require('underscore')

const list = [{ path: './util/request' }]

const routes = {
  brand: [
    { path: 'by-hostname' }
  ],
  listing: [
    { path: 'valert' }
  ],
  'user': [
    { path: 'signin' },
    { path: 'signup' },
    { path: 'signup-shadow' }
  ]
}

_.each(routes, (group, name) => {
  _.each(group, r => {

    let item = {
      path: './api/' + name + '/' + r.path
    }

    typeof r.auth === 'undefined'? list.push(item): list.unshift(item)
  })
})

module.exports = list
