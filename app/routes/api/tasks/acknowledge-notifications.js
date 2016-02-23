// api/tasks/acknowledge-notifictions.js
module.exports = (app, config) => {
  app.post('/api/tasks/acknowledge-notifications',(req, res) => {
    const api_url = config.api.url
    const access_token = req.body.access_token
    const endpoint = api_url + '/tasks/notifications/'
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