// api/posts/create-rec.js
module.exports = (app, config) => {
  app.post('/api/create-rec',(req, res) => {
    const api_url = config.api.url
    const rooms = req.body.rooms
    const users = req.body.users
    const emails = req.body.emails
    const phone_numbers = req.body.phone_numbers
    const mls_number = req.body.mls_number
    const message = req.body.message
    const notification = req.body.notification
    const endpoint = api_url + '/recs'
    const access_token = req.body.access_token
    const request_object = {
      mls_number,
      notification
    }
    if (message) {
      request_object.message = {
        message_type: 'SubLevel',
        comment: message,
        recommendation: 'SubLevel'
      }
    }
    if (rooms && rooms.length)
      request_object.rooms = rooms
    if (users && rooms.users)
      request_object.users = users
    if (emails && emails.length)
      request_object.emails = emails
    if (phone_numbers && phone_numbers.length)
      request_object.phone_numbers = phone_numbers
    fetch(endpoint, {
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