// api/posts/edit-profile-pic.js
module.exports = (app, config) => {
  app.post('/api/edit-profile-pic',(req, res) => {
    const user = req.body.user
    const api_url = config.api.url
    const endpoint = api_url + '/users/self/profile_image_url'
    const access_token = req.body.access_token
    const profile_image_url = req.body.profile_image_url
    const request_object = {
      profile_image_url
    }
    fetch(endpoint,{
      method: 'patch',
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