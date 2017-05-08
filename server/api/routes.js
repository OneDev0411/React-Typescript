const _ = require('underscore')

const list = []

const routes = {
  agent: [
    ['get-report'],
    ['search-agent']
  ],
  alert: [
    ['get-alerts'],
    ['get-alert-room'],
    ['acknowledge-notifications']
  ],
  brand: [
    ['get-brand-by-hostname']
  ],
  area: [
    ['search']
  ],
  county: [
    ['search']
  ],
  contact: [
    ['update-attributes'],
    ['delete-attribute']
  ],
  concierge: [
    ['put-review']
  ],
  deal: [
    ['envelope-document'],
    ['envelope-sign'],
    ['docusign-login'],
    ['save-submission-form'],
    ['submit-review-request']
  ],
  intercom: [
    ['signin'],
    ['signup']
  ],
  listing: [
    ['search'],
    ['listings'],
    ['similars'],
    ['valert']
  ],
  message: [
    ['messages']
  ],
  notification: [
    ['all'],
    ['delete'],
    ['delete-room-notifications'],
    ['mark-seen']
  ],
  rec: [
    ['actives'],
    ['feed'],
    ['mark'],
    ['favorites']
  ],
  room: [
    ['acknowledge-room-notifications'],
    ['add-user-to-room'],
    ['add-users'],
    ['create-alert'],
    ['create-message'],
    ['create-rec'],
    ['create-room'],
    ['delete-room'],
    ['edit-favorite'],
    ['get-actives'],
    ['get-rooms'],
    ['notifications'],
    ['remove-user-from-room']
  ],
  school: [
    ['search'],
    ['search-districts']
  ],
  subdivision: [
    ['search']
  ],
  user: [
    ['create-password'],
    ['edit-password'],
    ['edit-profile-pic'],
    ['edit-user'],
    ['email-verifications'],
    ['forgot-password'],
    ['get-favorites'],
    ['get-self'],
    ['get'],
    ['listing-inquiry'],
    ['phone-verifications'],
    ['reset-password'],
    ['search'],
    ['signin'],
    ['signup-shadow'],
    ['signup'],
    ['upgrade-account'],
    ['verify-phone']
  ]
}

_.each(routes, (group, name) => {
  _.each(group, (r) => {
    let item = {
      path: `./api/${name}/${r[0]}`
    }
    list.push(item)
  })
})

module.exports = list
