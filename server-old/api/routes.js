const _ = require('underscore')

const list = []

const routes = {
  proxifier: ['passthrough'],
  message: ['messages'],
  contact: ['export-outlook'],
  pdf: ['get-size'],
  user: ['refresh-token'],
  deal: [
    'docusign-login',
    'envelope-sign',
    'envelope-edit',
    'export-all-deals',
    'export-custom-report'
  ],
  'my-marketing-matters': ['punchout'],
  liveby: ['neighborhoods', 'report'],
  utils: ['get-url-metadata', 'render-mjml', 'cors']
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
