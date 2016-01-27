// api/posts/edit-contact.js
module.exports = (app, config) => {
  app.post('/api/edit-contact',(req, res) => {
    const api_url = config.api.url
    const contact = req.body.contact
    const endpoint = api_url + '/contacts/' + contact.id
    const access_token = req.body.access_token
    contact.push_allowed = true
    const request_object = contact
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
          message: 'There was an error with this request.'
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