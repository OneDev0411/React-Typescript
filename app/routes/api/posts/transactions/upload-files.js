// api/posts/transactions/upload-file.js
module.exports = (app, config) => {
  var superagent = require('superagent')
  app.post('/api/transactions/upload-file',(req, res) => {
    const api_url = config.api.url
    const access_token = req.body.access_token
    const files = req.body.files
    const id = req.query.id
    const endpoint = api_url + '/transactions/' + id + '/attachments'
    const request = superagent.post(endpoint)
    request.set('authorization', 'Bearer ' + access_token)
    files.forEach(file => {
      request.attach(file.name, file, (fileres) => {
        console.log(fileres)
      })
    })
    request.end(finalres => {
      console.log(3, res)
    })
  })
}