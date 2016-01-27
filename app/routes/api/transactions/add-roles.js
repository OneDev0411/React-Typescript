// api/transactions/add-contacts.js
module.exports = (app, config) => {
  app.post('/api/transactions/roles',(req, res) => {
    const api_url = config.api.url
    const id = req.query.id
    const endpoint = api_url + '/transactions/' + id
    const access_token = req.body.access_token
    const roles = req.body.roles
    const request_object = {
      roles
    }
    // console.log(endpoint, request_object)
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
      response.status = 'success'
      return res.json(response)
    });
  })
}