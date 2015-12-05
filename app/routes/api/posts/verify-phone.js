// api/posts/reset-password.js

import Crypto from '../../../models/Crypto'

module.exports = (app, config) => {
  
  app.post('/api/verify-phone',(req, res) => {

    const code_submitted = req.body.code
    const token = req.body.token

    const decrypted_token = Crypto.decrypt(token).split(':')
    const phone_number = decrypted_token[0]
    const code_token = decrypted_token[1]

    // Validate submitted_code against token code
    if(code_submitted !== code_token){
      let response_object = {
        status: "error"
      }
      return res.end(JSON.stringify(response_object))
    }

    const api_url = config.api.url
    const verify_phone_url = api_url + '/users/phone_confirmed'

    const request_object = {
      phone_number: phone_number,
      code: code_submitted
    }

    res.setHeader('Content-Type', 'application/json')
    
    fetch(verify_phone_url,{
      method: 'patch',
      headers: {  
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          "status": "error",
          "message": "There was an error with this request."
        }
        return res.end(JSON.stringify(error))
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.end(JSON.stringify(response_object))
    });
  })

}