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

    res.setHeader('Content-Type', 'application/json');

    fetch(get_messages_url,{
      method: 'get',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      }
    })
    .then(response => {
      if (response.status >= 400) {
        let error = {
          status: 'error',
          message: 'There was an error with this request'
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