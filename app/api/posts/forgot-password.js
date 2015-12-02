// api/posts/forgot-password.js
import config from '../../../config/private'

module.exports = app => {
  
  app.post('/api/forgot-password',(req, res) => {

    const email = req.body.email
    const api_url = config.api.url
    const signin_url = api_url + '/users/reset_password'

    const request_object = {
      'email': email
    }

    res.setHeader('Content-Type', 'application/json')
    
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
        return res.end(JSON.stringify(error))
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.end(JSON.stringify(response_object))
    });
  })

}