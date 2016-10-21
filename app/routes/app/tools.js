// tools.js
const request = require('request')
module.exports = (app, config) => {
  app.get('/delete-phone',(req, res) => {
    res.locals.api_host_local = config.api_host_local
    res.locals.title = 'Delete Phone'
    return res.render('templates/tool.html')
  })
}