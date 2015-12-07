// api/posts/create-message.js
module.exports = (app, config) => {
  
  app.post('/api/create-message',(req, res) => {

    const api_url = config.api.url
    const room_id = req.body.room_id
    const create_message_url = api_url + '/rooms/' + room_id + '/messages'

    const comment = req.body.comment
    const message_type = req.body.message_type
    const author = req.body.author
    const access_token = req.body.access_token

    const request_object = {
      comment: comment,
      message_type: message_type,
      author: author
    }
    
    res.setHeader('Content-Type', 'application/json');

    fetch(create_message_url,{
      method: 'post',
      headers: {  
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