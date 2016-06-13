// api/posts/edit-password.js
module.exports = (app, config) => {
  app.post('/api/edit-password',(req, res) => {
    const user = req.body.user
    const api_url = config.api.url
    const endpoint = api_url + '/users/self/password'
    const access_token = req.body.access_token
    const old_password = req.body.old_password
    const new_password = req.body.new_password
    const request_object = {
      old_password,
      new_password
    }
    fetch(endpoint,{
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
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
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}