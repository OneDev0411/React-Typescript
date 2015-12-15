// api/posts/forgot-password.js
module.exports = (app, config) => {
  
  app.post('/api/forgot-password',(req, res) => {

    const email = req.body.email
    const api_url = config.api.url
    const signin_url = api_url + '/users/reset_password'

    const request_object = {
      'email': email
    }

    fetch(signin_url,{
      method: 'post',
      headers: {  
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          "status": "error",
          "message": "There was an error with this request."
        }
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    });
  })

}