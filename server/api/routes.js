const _ = require('underscore')

const list = []

const routes = {
  agent: [
    [ 'get-report' ],
    [ 'search-agent' ]
  ],
  alert: [
    [ 'get-alerts' ],
    [ 'get-alert-room' ],
    [ 'acknowledge-notifications' ]
  ],
  brand: [
    [ 'get-brand-by-hostname' ]
  ],
  area: [
    [ 'search' ]
  ],
  contact: [
    [ 'create' ],
    [ 'delete' ],
    [ 'edit' ],
    [ 'get' ]
  ],
  county: [
    [ 'search' ]
  ],
  deal: [
    [ 'envelope-document' ],
    [ 'envelope-sign' ],
    [ 'docusign-login' ]
  ],
  intercom: [
    [ 'signin' ],
    [ 'signup' ]
  ],
  listing: [
    [ 'valert' ],
    [ 'listings' ],
    [ 'similars' ],
    [ 'search' ]
  ],
  message: [
    [ 'messages' ]
  ],
  notification: [
    [ 'summary' ]
  ],
  rec: [
    [ 'actives' ],
    [ 'feed' ],
    [ 'mark' ]
  ],
  room: [
    [ 'acknowledge-room-notifications' ],
    [ 'add-user-to-room' ],
    [ 'add-users' ],
    [ 'create-alert' ],
    [ 'create-message' ],
    [ 'create-rec' ],
    [ 'create-room' ],
    [ 'delete-room' ],
    [ 'edit-favorite' ],
    [ 'get-actives' ],
    [ 'get-rooms' ],
    [ 'notifications' ],
    [ 'remove-user-from-room' ],
  ],
  school: [
    [ 'search' ],
    [ 'search-districts' ]
  ],
  subdivision: [
    [ 'search' ]
  ],
  task: [
    [ 'acknowledge-notifications' ],
    [ 'add-contacts' ],
    [ 'add-transaction' ],
    [ 'create-task' ],
    [ 'delete-task' ],
    [ 'edit-date' ],
    [ 'edit-status' ],
    [ 'edit-title' ],
    [ 'get-tasks' ],
    [ 'remove-contact' ],
  ],
  tools: [
    [ 'delete-phone' ],
  ],
  transaction: [
    [ 'acknowledge-transaction-notifications' ],
    [ 'add-role' ],
    [ 'create-transaction' ],
    [ 'delete-file' ],
    [ 'delete-role' ],
    [ 'delete-transaction' ],
    [ 'edit-transaction' ],
    [ 'get-transaction' ],
    [ 'get-transactions' ]
  ],
  'user': [
    [ 'create-password' ],
    [ 'edit-password' ],
    [ 'edit-profile-pic' ],
    [ 'edit-user' ],
    [ 'email-verifications' ],
    [ 'forgot-password' ],
    [ 'get-favorites' ],
    [ 'get-self' ],
    [ 'get' ],
    [ 'listing-inquiry' ],
    [ 'phone-verifications' ],
    [ 'reset-password' ],
    [ 'search' ],
    [ 'signin' ],
    [ 'signup-shadow' ],
    [ 'signup' ],
    [ 'upgrade-account' ],
    [ 'verify-phone' ]
  ]
}

_.each(routes, (group, name) => {
  _.each(group, r => {

    let item = {
      path: './api/' + name + '/' + r[0]
    }

    list.push(item)
  })
})

module.exports = list
