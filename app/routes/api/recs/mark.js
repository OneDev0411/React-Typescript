// api/recs/mark.js
module.exports = (app, config) => {
  app.post('/api/recs/mark',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/recs/mark'
    const access_token = req.body.access_token
    const recommendations = req.body.recommendations
    const request_object = {
      recommendations
    }
    console.log(request_object)
    fetch(endpoint, {
      method: 'patch',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token
      },
      body: JSON.stringify(request_object)
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