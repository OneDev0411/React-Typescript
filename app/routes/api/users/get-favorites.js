// api/users/get-favorites.js
module.exports = (app, config) => {
  app.get('/api/user/get-favorites',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const endpoint = api_url + '/user/favorites'
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
      let response_object = {
        data: response,
        status: 'success'
      }
      return res.json(response_object)
    })
  })
}