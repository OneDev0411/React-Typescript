// api/posts/reset-password.js
import Crypto from '../../../models/Crypto'
import helpers from '../../../utils/helpers'
module.exports = (app, config) => {
  app.post('/api/reset-password',(req, res) => {
    let token = helpers.prepareToken(req.body.token)
    const password = req.body.password
    const decrypted_token = Crypto.decrypt(token).split(':')
    const email = decrypted_token[0]
    token = decrypted_token[1]
    const api_url = config.api.url
    const signin_url = api_url + '/users/password'
    const request_object = {
      email: email,
      token: token,
      password: password
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