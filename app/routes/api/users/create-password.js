// api/posts/create-password.js
import Crypto from '../../../models/Crypto'
import helpers from '../../../utils/helpers'
module.exports = (app, config) => {
  app.post('/api/create-password',(req, res) => {
    const email = req.body.email
    const new_email = req.body.new_email
    const phone_number = req.body.phone_number
    const token = req.body.token
    const password = req.body.password
    const agent = req.body.agent
    const api_url = config.api.url
    const endpoint = api_url + '/users/password'
    const request_object = {
      email,
      shadow_token: token,
      password
    }
    if (phone_number) {
      delete request_object.email
      request_object.phone_number = phone_number
    }
    if (agent)
      request_object.agent = agent
    fetch(endpoint,{
      method: 'patch',
      headers: {  
        'Content-Type': 'application/json',
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      console.log(response)
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