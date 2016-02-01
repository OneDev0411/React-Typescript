// api/tasks/edit-title.js
module.exports = (app, config) => {
  app.post('/api/tasks/edit-title',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const title = req.body.title
    const id = req.body.id
    const endpoint = api_url + '/tasks/' + id
    const request_object = {
      title
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