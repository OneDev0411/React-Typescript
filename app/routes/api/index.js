// api/index.js
module.exports = (app, config) => {
  // Gets
  require('./gets/rooms')(app, config)
  require('./gets/contacts')(app, config)
  require('./gets/messages')(app, config)
  require('./gets/transactions')(app, config)
  require('./gets/listings')(app, config)

  // Posts
  require('./posts/signup')(app, config)
  require('./posts/signin')(app, config)
  require('./posts/forgot-password')(app, config)
  require('./posts/reset-password')(app, config)
  require('./posts/verify-phone')(app, config)
  // Rooms
  require('./posts/rooms/create-room')(app, config)
  require('./posts/rooms/add-user-to-room')(app, config)
  require('./posts/rooms/create-message')(app, config)
  // Transactions
  require('./posts/transactions/create-transaction')(app, config)
  require('./posts/transactions/edit-transaction')(app, config)
  require('./posts/transactions/delete-transaction')(app, config)
  // Contacts
  require('./posts/contacts/create-contacts')(app, config)
  require('./posts/contacts/edit-contact')(app, config)
  require('./posts/contacts/delete-contact')(app, config)
}