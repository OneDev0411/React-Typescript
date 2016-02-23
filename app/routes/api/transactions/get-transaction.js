// api/gets/get-transaction.js
module.exports = (app, config) => {
  app.get('/api/get-transaction',(req, res) => {
    const api_url = config.api.url
    const access_token = req.query.access_token
    const id = req.query.id
    const endpoint = api_url + '/transactions/' + id
    fetch(endpoint,{
      method: 'get',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
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
    });
  })
}