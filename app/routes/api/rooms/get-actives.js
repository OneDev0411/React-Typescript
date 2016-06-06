// api/rooms/get-actives.js
module.exports = (app, config) => {
  app.get('/api/get-actives',(req, res) => {
    const api_url = config.api.url
    const room_id = req.query.room_id
    const access_token = req.query.access_token
    const endpoint = api_url + '/rooms/' + room_id + '/recs/actives'
    fetch(endpoint, {
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