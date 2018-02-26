const _ = require('underscore')

const list = []

const routes = {
  proxifier: [['passthrough'], ['upload'], ['export']],
  message: [['messages']],
  deal: [
    ['docusign-login'],
    ['envelope-sign'],
    ['download-pdf'],
    ['pdf-splitter']
  ],
  notification: [
    ['all'],
    ['delete'],
    ['delete-room-notifications'],
    ['mark-seen']
  ]
}

_.each(routes, (group, name) => {
  _.each(group, route => {
    let item = {
      path: `./api/${name}/${route[0]}`
    }

    list.push(item)
  })
})

module.exports = list
