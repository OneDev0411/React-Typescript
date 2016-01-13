// marketing.js
// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

module.exports = (app, config, req, res, callback) => {
  // Add marketing / server-side page content here
  if(req.url !== '/')
    return callback()
  else {
    AppDispatcher.dispatch({
      action: 'get-content',
      slug: 'landing-page',
      rendered: 'server',
      res,
      callback
    })
  }
}