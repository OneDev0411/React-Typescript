// api/tasks/add-transaction.js
module.exports = (app, config) => {
  app.post('/api/tasks/add-transaction',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const task_id = req.body.task
    const transaction_id = req.body.transaction
    const endpoint = api_url + '/tasks/' + task_id
    const request_object = {
      transaction: transaction_id
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