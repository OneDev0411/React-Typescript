// api/posts/acknowledge-room-notifications.js
module.exports = (app, config) => {
  app.post('/api/acknowledge-room-notifications',(req, res) => {
    const api_url = config.api.url
    const room = req.body.room
    const endpoint = api_url + '/rooms/' + room + '/notifications'
    const access_token = req.body.access_token
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