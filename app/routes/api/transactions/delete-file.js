// api/transactions/delete-role.js
module.exports = (app, config) => {
  app.post('/api/transactions/delete-file',(req, res) => {
    const api_url = config.api.url
    const id = req.query.id
    const file = req.body.file
    const endpoint = api_url + '/transactions/' + id + '/attachments/' + file
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