// api/alerts/acknowledge-notifications.js
module.exports = (app, config) => {
  app.post('/api/acknowledge-alert-notifications',(req, res) => {
    const api_url = config.api.url
    const alert = req.body.alert
    const endpoint = api_url + '/alerts/' + alert + '/notifications'
    const access_token = req.body.access_token
    console.log(endpoint)
    fetch(endpoint,{
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
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}