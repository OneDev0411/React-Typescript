// api/posts/signup-shadow.js
module.exports = (app, config) => {
  app.post('/api/signup-shadow',(req, res) => {
    const api_url = config.api.url
    const email = req.body.email
    const password = req.body.password
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
    const endpoint = api_url + '/users'
    fetch(endpoint,{
      method: 'post',
      headers: {  
        'Content-Type': 'application/json'
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