// api/alerts/get-alerts.js
module.exports = (app, config) => {
  app.get('/api/alerts/get-alerts',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const endpoint = api_url + '/alerts'
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
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}