// api/index.js
module.exports = (app, config) => {
  // Contacts
  require('./contacts/get-contacts')(app, config)
  // Messages
  require('./messages/get-messages')(app, config)
  // Listings
  require('./listings/get-listings')(app, config)
  require('./listings/get-similars')(app, config)
  // Users
  require('./users/signup')(app, config)
  require('./users/signin')(app, config)
  require('./users/forgot-password')(app, config)
  require('./users/reset-password')(app, config)
  require('./users/verify-phone')(app, config)
  // Rooms
  require('./rooms/create-room')(app, config)
  require('./rooms/get-rooms')(app, config)
  require('./rooms/add-user-to-room')(app, config)
  require('./rooms/create-message')(app, config)
  require('./rooms/invite-contacts')(app, config)
  require('./rooms/notifications')(app, config)
  // Transactions
  require('./transactions/create-transaction')(app, config)
  require('./transactions/get-transactions')(app, config)
  require('./transactions/get-transaction')(app, config)
  require('./transactions/edit-transaction')(app, config)
  require('./transactions/add-role')(app, config)
  require('./transactions/delete-role')(app, config)
  require('./transactions/delete-transaction')(app, config)
  // Contacts
  require('./contacts/create-contacts')(app, config)
  require('./contacts/edit-contact')(app, config)
  require('./contacts/delete-contact')(app, config)
  // Tasks
  require('./tasks/create-task')(app, config)
  require('./tasks/delete-task')(app, config)
  require('./tasks/get-tasks')(app, config)
  require('./tasks/edit-status')(app, config)
  require('./tasks/edit-title')(app, config)
  require('./tasks/edit-date')(app, config)
  require('./tasks/add-contacts')(app, config)
  require('./tasks/remove-contact')(app, config)
  require('./tasks/add-transaction')(app, config)
}