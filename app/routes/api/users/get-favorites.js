// api/users/get-favorites.js
module.exports = (app, config) => {
  app.get('/api/users/get-favorites',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const endpoint = api_url + '/users/favorites'
    fetch(endpoint,{
      method: 'get',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token
      }
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