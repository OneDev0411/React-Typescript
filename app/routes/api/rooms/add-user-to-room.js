// api/posts/add-user-to-room.js
module.exports = (app, config) => {
  app.post('/api/add-user-to-room',(req, res) => {
    const api_url = config.api.url
    const room_id = req.body.room_id
    const endpoint = api_url + '/rooms/' + room_id + '/users'
    const user = req.body.user
    const access_token = req.body.access_token
    const request_object = {
      user: [user]
    }
    fetch(endpoint,{
      method: 'post',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent': req.headers['user-agent'],
        'user-agent': config.app_name,
        'x-rechat-brand': req.body.brand
      },
      body: JSON.stringify(request_object)
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
      console.log(response.status)
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}