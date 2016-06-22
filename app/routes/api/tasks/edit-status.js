// api/tasks/edit-status.js
module.exports = (app, config) => {
  app.post('/api/tasks/edit-status',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const status = req.body.status
    const id = req.body.id
    const endpoint = api_url + '/tasks/' + id
    const request_object = {
      status
    }
    fetch(endpoint,{
      method: 'put',
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