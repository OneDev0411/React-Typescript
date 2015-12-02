// api/posts/add-room.js
import config from '../../../config/private'

module.exports = app => {
  
  app.post('/api/create-room',(req, res) => {

    const api_url = config.api.url
    const create_room_url = api_url + '/rooms'

    const title = req.body.title
    const owner = req.body.owner
    const access_token = req.body.access_token

    const request_object = {
      title: title,
      client_type: 'Unknown',
      room_type: 'Group',
      owner: owner
    }

    res.setHeader('Content-Type', 'application/json');

    fetch(create_room_url,{
      method: 'post',
      headers: {  
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          "status": "error",
          "message": "There was an error with this request."
        }
        return res.end(JSON.stringify(error))
      }
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.end(JSON.stringify(response_object))
    });
  })

}