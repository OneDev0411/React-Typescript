// api/alerts/create-alert.js
module.exports = (app, config) => {
  app.post('/api/alerts/create-alert',(req, res) => {
    const api_url = config.api.url
    const alert = req.body.alert
    const users = req.body.users
    const emails = req.body.emails
    const phone_numbers = req.body.phone_numbers
    const request_object = {
      alert
    }
    if (users)
      request_object.users = users
    if (emails)
      request_object.emails = emails
    if (phone_numbers)
      request_object.phone_numbers = phone_numbers
    // console.log(request_object)
    const access_token = req.body.access_token
    const endpoint = api_url + '/alerts'
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
      // console.log(response)
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })

}