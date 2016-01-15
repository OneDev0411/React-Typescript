// api/posts/transactions/upload-file.js
const fs = require('fs')
const superagent = require('superagent')
module.exports = (app, config) => {
  app.post('/api/transactions/upload-file',(req, res) => {
    const api_url = config.api.url
    const access_token = req.body.access_token
    const files = req.body.files
    const id = req.query.id
    const endpoint = api_url + '/transactions/' + id + '/attachments'
    const request = superagent.post(endpoint)
    console.log(files)
    request.set('authorization', 'Bearer ' + access_token)
    files.forEach(file => {
      console.log(file)
      request.attach(file.name, fs.createReadStream(file.name))
    })
    request.end((err, res) => {
      if (err) {
        console.log('error', err);
      } else {
        console.log('success', res);
      }
    })
  })
}