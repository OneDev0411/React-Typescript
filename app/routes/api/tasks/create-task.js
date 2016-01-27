// api/tasks/create-task.js
module.exports = (app, config) => {
  app.post('/api/tasks',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/tasks'
    const access_token = req.body.access_token
    const title = req.body.title
    const due_date = req.body.due_date
    const request_object = {
      title,
      status: 'New',
      due_date
    }
    fetch(endpoint,{
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