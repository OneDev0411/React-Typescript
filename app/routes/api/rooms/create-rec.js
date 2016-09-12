// api/posts/create-rec.js
module.exports = (app, config) => {
  app.post('/api/create-rec',(req, res) => {
    const api_url = config.api.url
    const mls_number = req.body.mls_number
    const message = req.body.message
    const notification = req.body.notification
    const room = req.body.room
    const endpoint = api_url + '/rooms/' + room + '/recs'
    const access_token = req.body.access_token
    const request_object = {
      mls_number,
      notification
    }
    if (message) {
      request_object.message = {
        message_type: 'SubLevel',
        comment: message,
        recommendation: 'SubLevel'
      }
    }
    fetch(endpoint, {
      method: 'post',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent' : req.headers['user-agent'],
        'user-agent' : config.app_name
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