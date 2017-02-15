const _ = require('underscore')

const list = [{ path: './util/request' }]

const routes = {
  brand: [
    { path: 'get-brand-by-hostname' }
  ],
  'user': [
    { path: 'signin' }
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
