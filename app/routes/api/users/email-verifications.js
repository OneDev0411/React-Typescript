// api/posts/email-verifications.js
module.exports = (app, config) => {
  app.post('/api/email-verifications',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/email_verifications'
    const access_token = req.body.access_token
    fetch(endpoint, {
      method: 'post',
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