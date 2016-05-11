// verify.js
import Crypto from '../../models/Crypto'
import helpers from '../../utils/helpers'
module.exports = (app, config) => {
  app.get('/verify_email',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const encoded_token = encodeURIComponent(decoded_token)
    return res.redirect('/verify/email?token=' + encoded_token)
  })
  // For testing purposes only
  app.get('/decrypt',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    console.log(decrypted_obj)
    return res.end()
  })
  app.get('/activate',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const email = decrypted_obj.email
    const token = decrypted_obj.token
    const agent = decrypted_obj.agent
    if (agent) {
      const first_name = agent.first_name
      const last_name = agent.last_name
      const id = agent.id
      return res.redirect('/password/create?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email) + '&first_name=' + encodeURIComponent(first_name) + '&last_name=' + encodeURIComponent(last_name) + '&agent=' + id)
    }
    return res.redirect('/password/create?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email))
  })
  app.get('/verify/email',(req, res) => {
    let AppStore = {}
    AppStore.data = {
      status: 'success'
    }
    if(req.query.status == 'error'){
      AppStore.data = {
        status: 'error'
      }
    }
    res.locals.AppStore = JSON.stringify(AppStore)
    return res.render('index.html')
  })
  app.get('/verify_email/submitted',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const email = decrypted_obj.email
    const email_code = decrypted_obj.email_code
    const token = decrypted_obj.token
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
      return res.redirect('/verify/email?status=success&token=' + token + '&email=' + encodeURIComponent(email))
    })
  })
  app.get('/verify_phone',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const encoded_token = encodeURIComponent(decoded_token)
    return res.redirect('/verify/phone?token=' + encoded_token)
  })
  app.get('/reset_password',(req, res) => {    
    const decoded_token = decodeURIComponent(req.query.token)
    const encoded_token = encodeURIComponent(decoded_token)
    // TODO: test token for validity then redirect to forgot password
    return res.redirect('/password/reset/?token=' + encoded_token)
  })
  // Signup redirect (if has token)
  app.get('/signup',(req, res, next) => {
    const token = req.query.token
    if (token) {
      const decoded_token = decodeURIComponent(req.query.token)
      const encoded_token = encodeURIComponent(decoded_token)
      return res.redirect('/activate?token=' + encoded_token)
    }
    return next()
  })
}