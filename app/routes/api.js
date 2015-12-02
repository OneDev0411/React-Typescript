// api.js
module.exports = (app, config) => {

  // Gets
  require('../api/gets/rooms')(app, config)

  // Posts
  require('../api/posts/signin')(app, config)
  require('../api/posts/forgot-password')(app, config)
  require('../api/posts/reset-password')(app, config)
  require('../api/posts/create-room')(app, config)
  
}