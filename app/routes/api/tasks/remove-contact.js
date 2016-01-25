// api/tasks/remove-contact.js
module.exports = (app, config) => {
  app.post('/api/tasks/remove-contact',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const contact = req.body.contact
    const task = req.body.task
    const endpoint = api_url + '/tasks/' + task.id +'/contacts/' + contact.id
    fetch(endpoint, {
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
      return response.json()
    })
    .then(response => {
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}