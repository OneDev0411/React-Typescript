// api/tasks/add-contacts.js
module.exports = (app, config) => {
  app.post('/api/tasks/add-contacts',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const contacts = req.body.contacts
    const task = req.body.task
    const endpoint = api_url + '/tasks/' + task.id +'/contacts'
    const request_object = {
      contacts
    }
    fetch(endpoint,{
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