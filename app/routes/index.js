// index.js
module.exports = (app, config) => {

  /* API routes first
  ============================ */
  // Gets
  require('./api/gets/rooms')(app, config)

  // Posts
  require('./api/posts/signup')(app, config)
  require('./api/posts/signin')(app, config)
  require('./api/posts/forgot-password')(app, config)
  require('./api/posts/reset-password')(app, config)
  require('./api/posts/verify-phone')(app, config)
  require('./api/posts/create-room')(app, config)

  /* App routes
  ============================ */
  require('./app')(app, config)
  require('./app/verify')(app, config)

  /* React routes
  ============================ */
  require('./React')(app, config)

}