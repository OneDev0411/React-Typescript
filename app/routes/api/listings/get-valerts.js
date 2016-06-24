// api/listings/get-valerts.js
module.exports = (app, config) => {
  app.post('/api/listings/valerts',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/valerts'
    const access_token = req.body.access_token
    const options = req.body.options
    const headers = {  
      'Content-Type': 'application/json',
      'x-real-agent': req.headers['user-agent'],
      'user-agent': config.app_name
    }
    if (access_token)
      headers.authorization = 'Bearer ' + access_token
    fetch(endpoint,{
      method: 'post',
      headers,
      body: JSON.stringify(options)
    })
    .then(response => {
      if (response.status >= 400) {
        let error = {
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
    })
  })
}