// api/tasks/delete-task.js
module.exports = (app, config) => {
  app.post('/api/tasks/delete-task',(req, res) => {
    const api_url = config.api.url
    const access_token = req.body.access_token
    const task = req.body.task
    const endpoint = api_url + '/tasks/' + task.id
    fetch(endpoint,{
      method: 'delete',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      }
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}