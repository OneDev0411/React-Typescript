// api/posts/invite-contacts.js
module.exports = (app, config) => {
  app.post('/api/invite-contacts', (req, res) => {
    const api_url = config.api.url
    const room_id = req.body.room_id
    const endpoint = api_url + '/invitations'
    const invitations = req.body.invitations
    const access_token = req.body.access_token
    const request_object = {
      invitations
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