// verify.js
import Crypto from '../../models/Crypto'
import helpers from '../../utils/helpers'
module.exports = (app, config) => {
  app.get('/verify_email',(req, res) => {
    const token = decodeURIComponent(req.query.token)
    return res.redirect('/verify/email?token=' + token)
  })
  app.get('/activate',(req, res) => {
    const token = decodeURIComponent(req.query.token)
    return res.redirect('/verify/email?token=' + token)
  })
  app.get('/verify_email/submitted',(req, res) => {
    let token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(token))
    const email = decrypted_obj.email
    const email_code = decrypted_obj.email_code
    token = decrypted_obj.token
    const agent = decrypted_obj.agent
    const api_url = config.api.url
    const verify_email_url = api_url + '/users/email_confirmed'
    const request_object = {
      email
    }
    if (email_code)
      request_object.email_code = email_code
    if (token)
      request_object.token = token
    if (agent)
      request_object.agent = agent
    fetch(verify_email_url,{
      method: 'patch',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        // redirect to error page
        return res.redirect('/verify/email?status=error')
      }
      return response.json()
    })
    .then(response => {
      // redirect to success page
      return res.redirect('/verify/email?status=success&token=' + token)
    })
  })

  app.get('/verify_phone',(req, res) => {
    const token = req.query.token
    return res.redirect('/verify/phone?token=' + token)
  })

  app.get('/reset_password',(req, res) => {    
    const token = req.query.token
    // TODO: test token for validity then redirect to forgot password
    return res.redirect('/password/reset/?token=' + token)
  })
}