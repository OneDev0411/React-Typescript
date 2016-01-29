// api/tasks/edit-status.js
module.exports = (app, config) => {
  app.post('/api/tasks/edit-status',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const status = req.body.status
    const task = req.body.task
    const endpoint = api_url + '/tasks/' + task.id
    const request_object = {
      status
    }
    fetch(endpoint,{
      method: 'put',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          message: 'There was an error with this request.'
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