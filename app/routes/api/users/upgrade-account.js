// api/posts/upgrade-account.js
module.exports = (app, config) => {
  app.post('/api/upgrade-account',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/users/self/upgrade'
    const agent = req.body.agent
    const secret = req.body.secret
    const access_token = req.body.access_token
    const request_object = {
      agent,
      secret
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
      return response
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}