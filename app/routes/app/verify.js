// verify.js

// Crypto
import Crypto from '../../models/Crypto'

module.exports = (app, config) => {

  app.get('/verify_email',(req, res) => {
    
    const token = req.query.token
    const decrypted_token = Crypto.decrypt(token).split(':')
    const email = decrypted_token[0]
    const code = decrypted_token[1]
    
    const api_url = config.api.url
    const verify_email_url = api_url + '/users/email_confirmed'

    const request_object = {
      email: email,
      code: code
    }

    fetch(verify_email_url,{
      method: 'patch',
      headers: {  
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        // redirect to error page
        return res.end(JSON.stringify(response))
      }
      return response.json()
    })
    .then((response) => {
      // redirect to success page
      return res.end(JSON.stringify(response))
    })
  })

  app.get('/verify_phone',(req, res) => {
    
    const token = req.query.token
    const decrypted_token = Crypto.decrypt(token).split(':')
    const phone_number = decrypted_token[0]
    const code = decrypted_token[1]
    
    const api_url = config.api.url
    const verify_email_url = api_url + '/users/phone_confirmed'
    
    const request_object = {
      phone_number: phone_number,
      code: code
    }

    fetch(verify_email_url,{
      method: 'patch',
      headers: {  
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then((response) => {
      if (response.status >= 400) {
        // redirect to error page
        return res.end(JSON.stringify(response))
      }
      return response.json()
    })
    .then((response) => {
      // redirect to success page
      return res.end(JSON.stringify(response))
    })
  })

  app.get('/reset_password',(req, res) => {
    
    const token = req.query.token

    // TODO: test token for validity then redirect to forgot password
    return res.redirect('/password/reset/?token=' + token)

  })

}