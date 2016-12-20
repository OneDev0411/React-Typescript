// api/gets/rooms.js
module.exports = (app, config) => {
  app.get('/api/rooms',(req, res) => {
    const api_url = config.api.url
    const limit = 10000
    const get_rooms_url = api_url + '/rooms?limit=' + limit
    const access_token = req.query.access_token
    fetch(get_rooms_url,{
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
        let error = {
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
    })
  })
}