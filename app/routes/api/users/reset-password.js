// api/posts/reset-password.js
import Crypto from '../../../models/Crypto'
import helpers from '../../../utils/helpers'
module.exports = (app, config) => {
  app.post('/api/reset-password',(req, res) => {
    const decoded_token = decodeURIComponent(req.body.token)
    const password = req.body.password
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const email = decrypted_obj.email
    const token = decrypted_obj.token
    const api_url = config.api.url
    const signin_url = api_url + '/users/password'
    const request_object = {
      email,
      token,
      password
    }
    fetch(signin_url,{
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