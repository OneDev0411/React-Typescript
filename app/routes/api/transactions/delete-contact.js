// api/transactions/delete-contact.js
module.exports = (app, config) => {
  app.post('/api/transactions/delete-contact',(req, res) => {
    const api_url = config.api.url
    const id = req.query.id
    const contact = req.body.contact
    const endpoint = api_url + '/transactions/' + id + '/contacts/' + contact.id
    const access_token = req.body.access_token
    fetch(endpoint, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      }
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
      response.status = 'success'
      return res.json(response)
    });
  })
}