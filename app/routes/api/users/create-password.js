// api/posts/create-password.js
import Crypto from '../../../models/Crypto'
import helpers from '../../../utils/helpers'
module.exports = (app, config) => {
  app.post('/api/create-password',(req, res) => {
    const email = req.body.email
    const token = req.body.token
    const password = req.body.password
    const api_url = config.api.url
    const endpoint = api_url + '/users/password'
    const request_object = {
      email,
      shadow_token: token,
      password
    }
    fetch(endpoint,{
      method: 'patch',
      headers: {  
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          response
        }
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}