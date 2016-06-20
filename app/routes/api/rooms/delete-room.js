// api/rooms/delete-room.js
module.exports = (app, config) => {
  app.get('/api/delete-room',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/rooms/' + req.query.id
    fetch(endpoint,{
      method: 'delete',
      headers: {
        'authorization': 'Bearer ' + req.query.access_token,
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
      return response
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}