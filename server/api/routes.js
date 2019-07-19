const _ = require('underscore')

const list = []

const routes = {
  proxifier: ['passthrough'],
  message: ['messages'],
  contact: ['export-outlook'],
  pdf: ['get-size'],
  deal: [
    'docusign-login',
    'envelope-sign',
    'envelope-edit',
    'export-all-deals',
    'export-custom-report'
  ]
}

_.each(routes, (group, name) => {
  _.each(group, route => {
    let item = {
      path: `./api/${name}/${route}`
    }

    list.push(item)
  })
})

module.exports = list
