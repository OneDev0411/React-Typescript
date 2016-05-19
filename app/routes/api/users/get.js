// api/users/get.js
import config from '../../../../config/private'
module.exports = (app, config) => {
  app.get('/api/users/:id',(req, res) => {
    const api_url = config.api.url
    const id = req.params.id
    const access_token = req.query.access_token
    const endpoint = api_url + '/users/' + id
    fetch(endpoint,{
      method: 'get',
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
      return res.json(response)
    });
  })
}