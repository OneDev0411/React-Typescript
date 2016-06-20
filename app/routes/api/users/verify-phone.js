// api/posts/verify-phone.js
import Crypto from '../../../models/Crypto'
import helpers from '../../../utils/helpers'
module.exports = (app, config) => {
  app.post('/api/verify-phone',(req, res) => {
    const code_submitted = req.body.code
    const decoded_token = decodeURIComponent(req.body.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const phone_number = decrypted_obj.phone_number
    const phone_code = decrypted_obj.phone_code
    // Validate submitted_code against token code
    if(code_submitted !== phone_code){
      let response_object = {
        status: 'error'
      }
      return res.end(JSON.stringify(response_object))
    }
    const api_url = config.api.url
    const verify_phone_url = api_url + '/users/phone_confirmed'
    const request_object = {
      phone_number: phone_number,
      code: phone_code
    }
    fetch(verify_phone_url,{
      method: 'patch',
      headers: {  
        'Content-Type': 'application/json',
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
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