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
  require('./posts/create-room')(app, config)
  require('./posts/add-user-to-room')(app, config)
  require('./posts/create-message')(app, config)
  require('./posts/create-transaction')(app, config)
  require('./posts/delete-transaction')(app, config)
}