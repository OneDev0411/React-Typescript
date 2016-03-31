// api/alerts/get-alert.js
module.exports = (app, config) => {
  app.get('/api/alerts/get-alert',(req, res) => {
    const api_url = config.api.url
    const room_id = req.query.room_id
    const alert_id = req.query.alert_id
    const access_token = req.query.access_token
    const endpoint = api_url + '/rooms/' + room_id + '/recs/feed?filter=' + alert_id + '&sorting_value=Update'
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
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}