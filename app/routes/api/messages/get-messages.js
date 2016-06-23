// api/gets/messages.js
module.exports = (app, config) => {
  app.get('/api/messages',(req, res) => {
    const api_url = config.api.url
    // Params
    const access_token = req.query.access_token
    const room_id = req.query.room_id
    const limit = req.query.limit
    const max_value = req.query.max_value
    const get_messages_url = api_url + '/rooms/' + room_id + '/messages?limit=' + limit + '&max_value=' + max_value
    fetch(get_messages_url,{
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
    });
  })
}