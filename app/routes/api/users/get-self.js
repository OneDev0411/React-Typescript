// api/users/get.js
import config from '../../../../config/private'
module.exports = (app, config) => {
  app.get('/api/users/get-user/self',(req, res) => {
    const api_url = config.api.url
    const id = req.params.id
    const access_token = req.query.access_token
    const endpoint = api_url + '/users/self'
    fetch(endpoint,{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
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