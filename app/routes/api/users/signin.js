// api/posts/signin.js
import config from '../../../../config/private'

// Room
import Room from '../../../models/Room'

module.exports = (app, config) => {
  
  app.post('/api/signin',(req, res) => {

    const email = req.body.email
    const password = req.body.password
    const api_url = config.api.url
    const invite = req.body.invite
    const signin_url = api_url + '/oauth2/token'

    const request_object = {
      client_id: config.api.client_id,
      client_secret: config.api.client_secret,
      username: email,
      password: password,
      grant_type: 'password'
    }

    fetch(signin_url,{
      method: 'post',
      credentials: 'include',
      headers: {  
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return res.json(error)
      }
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      let user = response.data
      user.access_token = response.access_token
      req.session.user = user

      // check for invite vars
      if(invite){
        const add_user_params = {
          room_id: invite.room_id,
          user: user.id,
          access_token: invite.invite_token,
          api_host: config.app_url
        }
        Room.addUser(add_user_params, (err, response) => {
          return res.json(response_object)
        })
        
      } else {
        
        return res.json(response_object)

      }
    });
  })

}