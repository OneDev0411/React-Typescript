// api/posts/signup-shadow.js
module.exports = (app, config) => {
  app.post('/api/signup-shadow',(req, res) => {
    const api_url = config.api.url
    const email = req.body.email
    const password = req.body.password
    const user_connect = req.body.user_connect
    const room_connect = req.body.room_connect
    const phone_number = req.body.phone_number
    const actions = req.body.actions

    const request_object = {
      client_id: config.api.client_id,
      client_secret: config.api.client_secret,
      email: email,
      first_name: email,
      last_name: '',
      user_type: 'Client',
      password: password,
      grant_type: 'password',
      is_shadow: true
    }
    if (user_connect)
      request_object.user_connect = user_connect
    if (room_connect)
      request_object.room_connect = room_connect
    if (phone_number)
      request_object.phone_number = phone_number
    if (actions)
      request_object.actions = actions

    const endpoint = api_url + '/users'
    fetch(endpoint,{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-real-agent': req.headers['user-agent'],
        'user-agent': config.app_name,
        'x-rechat-brand': req.body.brand
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