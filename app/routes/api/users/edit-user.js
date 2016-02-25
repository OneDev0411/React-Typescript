// api/posts/edit-user.js
module.exports = (app, config) => {
  app.post('/api/edit-user',(req, res) => {
    const user = req.body.user
    const api_url = config.api.url
    const endpoint = api_url + '/users/self'
    const access_token = req.body.access_token
    const request_object = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number
    }
    fetch(endpoint,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
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