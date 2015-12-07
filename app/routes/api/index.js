// api/index.js
module.exports = (app, config) => {
  
  // Gets
  require('./gets/rooms')(app, config)

  // Posts
  require('./posts/signup')(app, config)
  require('./posts/signin')(app, config)
  require('./posts/forgot-password')(app, config)
  require('./posts/reset-password')(app, config)
  require('./posts/verify-phone')(app, config)
  require('./posts/create-room')(app, config)

}