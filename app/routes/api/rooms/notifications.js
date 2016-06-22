// api/posts/notifications.js
module.exports = (app, config) => {
  app.post('/api/notifications',(req, res) => {
    const api_url = config.api.url
    const id = req.body.id
    const notification = req.body.notification
    const endpoint = api_url + '/rooms/' + id + '/notifications'
    const access_token = req.body.access_token
    const request_object = {
      notification
    }
    fetch(endpoint,{
      method: 'patch',
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