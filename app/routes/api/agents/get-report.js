// api/agents/get-report.js
module.exports = (app, config) => {
  app.post('/api/agents/get-report',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/agents/report'
    const criteria = req.body.criteria
    const access_token = req.body.access_token
    const request_object = { criteria }
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