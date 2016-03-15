// api/posts/signup.js
module.exports = (app, config) => {
  app.post('/api/signup',(req, res) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const email = req.body.email
    const user_type = req.body.user_type
    const password = req.body.password
    const grant_type = req.body.grant_type
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
    fetch(signup_url,{
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
        return res.json(error)
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