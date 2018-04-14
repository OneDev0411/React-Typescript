const _ = require('underscore')

const list = []

const routes = {
  proxifier: ['passthrough', 'upload'],
  message: ['messages'],
  contact: ['export-outlook'],
  deal: [
    'docusign-login',
    'envelope-sign',
    'download-pdf',
    'pdf-splitter',
    'envelope-edit',
    'export'
  ],
  notification: ['all', 'delete', 'delete-room-notifications', 'mark-seen']
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
