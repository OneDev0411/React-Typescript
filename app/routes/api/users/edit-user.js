// api/posts/edit-user.js
module.exports = (app, config) => {
  app.post('/api/edit-user',(req, res) => {
    const user = req.body.user
    const api_url = config.api.url
    const signup_url = api_url + '/users/self'
    const access_token = req.body.access_token
    const request_object = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number
    }
    fetch(signup_url,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      // console.log(response.body)
      if (response.status >= 400) {
        var error = {
          status: 'error',
          body: response.body
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