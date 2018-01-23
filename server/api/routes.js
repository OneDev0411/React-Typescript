const _ = require('underscore')

const list = []

const routes = {
  proxifier: [['passthrough'], ['upload']],
  agent: [['get-report'], ['search-agent']],
  alert: [['get-alerts'], ['get-alert-room'], ['acknowledge-notifications']],
  intercom: [['signin'], ['signup']],
  listing: [['search'], ['listings']],
  message: [['messages']],
  deal: [
    ['docusign-login'],
    ['envelope-sign'],
    ['download-pdf'],
    ['download-excel'],
    ['pdf-splitter']
  ],
  notification: [['all'], ['delete'], ['delete-room-notifications'], ['mark-seen']],
  rec: [['actives'], ['feed'], ['mark'], ['favorites']],
  room: [['create-rec']]
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
