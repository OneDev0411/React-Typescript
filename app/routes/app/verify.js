// verify.js
import Crypto from '../../models/Crypto'
import helpers from '../../utils/helpers'
module.exports = (app, config) => {
  app.get('/verify_email',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const encoded_token = encodeURIComponent(decoded_token)
    return res.redirect('/verify/email?token=' + encoded_token)
  })
  app.get('/activate',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    const email = decrypted_obj.email
    const token = decrypted_obj.token
    const agent = decrypted_obj.agent
    const phone_number = decrypted_obj.phone_number
    const inviting_user = decrypted_obj.inviting_user
    const room = decrypted_obj.room
    const action = req.query.action
    const listing_id = req.query.listing_id
    const room_id = req.query.room_id
    const alert_id = req.query.alert_id
    // Reset session and save branch data
    const branch_data = decrypted_obj
    delete req.session.user
    req.session.branch_data = branch_data
    // Agent
    if (agent) {
      const first_name = agent.first_name
      const last_name = agent.last_name
      const id = agent.id
      return res.redirect('/password/create?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email) + '&first_name=' + encodeURIComponent(first_name) + '&last_name=' + encodeURIComponent(last_name) + '&agent=' + id)
    }
    // Client
    if (token && email) {
      let url = '/password/create?token=' + encodeURIComponent(token) + '&email=' + encodeURIComponent(email)
      if (action)
        url = url + '&action=' + action
      if (listing_id)
        url = url + '&listing_id=' + listing_id
      if (room_id)
        url = url + '&room_id=' + room_id
      if (alert_id)
        url = url + '&alert_id=' + alert_id
      return res.redirect(url)
    }
    // Invite SMS
    if (phone_number && inviting_user && room)
      return res.redirect('/signup?phone_number=' + encodeURIComponent(phone_number) + '&inviting_user=' + encodeURIComponent(inviting_user) + '&room=' + encodeURIComponent(room))
    return res.redirect('/?message=error')
  })
  app.get('/verify/email',(req, res) => {
    // Logout user
    delete req.session.user
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
      if (response.data.is_shadow)
        return res.redirect('/verify/email?status=success&token=' + token + '&email=' + encodeURIComponent(email))
      else
        return res.redirect('/signin?message=phone-signup-success')
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