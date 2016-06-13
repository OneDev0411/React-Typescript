// api/posts/signup.js
module.exports = (app, config) => {
  app.post('/api/signup',(req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const user_type = req.body.user_type
    const password = req.body.password
    const grant_type = req.body.grant_type
    const user_connect = req.body.user_connect
    const room_connect = req.body.room_connect
    const phone_number = req.body.phone_number
    const api_url = config.api.url
    const signup_url = api_url + '/users'
    const request_object = {
      client_id: config.api.client_id,
      client_secret: config.api.client_secret,
      first_name: first_name,
      last_name: last_name,
      email: email,
      user_type: user_type,
      password: password,
      grant_type: grant_type
    }
    if (user_connect)
      request_object.user_connect = user_connect
    if (room_connect)
      request_object.room_connect = room_connect
    if (phone_number)
      request_object.phone_number = phone_number
    fetch(signup_url,{
      method: 'post',
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
        return res.status(response.status).json(error)
      }
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}