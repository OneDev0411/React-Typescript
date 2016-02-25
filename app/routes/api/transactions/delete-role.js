// api/transactions/delete-role.js
module.exports = (app, config) => {
  app.post('/api/transactions/delete-role',(req, res) => {
    const api_url = config.api.url
    const id = req.query.id
    const role = req.body.role
    const endpoint = api_url + '/transactions/' + id + '/roles/' + role.id
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
          response
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