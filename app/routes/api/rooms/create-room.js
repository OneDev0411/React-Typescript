// api/posts/create-room.js
module.exports = (app, config) => {
  app.post('/api/create-room',(req, res) => {
    const api_url = config.api.url
    const create_room_url = api_url + '/rooms'
    const users = req.body.users
    const emails = req.body.emails
    const phone_numbers = req.body.phone_numbers
    const owner = req.body.owner
    const access_token = req.body.access_token
    const request_object = {
      users,
      emails,
      phone_numbers,
      client_type: 'Unknown',
      room_type: 'Group',
      owner
    }
    fetch(create_room_url,{
      method: 'post',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name,
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
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}