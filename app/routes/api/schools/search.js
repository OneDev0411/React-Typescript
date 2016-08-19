// api/schools/search.js
module.exports = (app, config) => {
  app.get('/api/schools/search',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/schools/search?district=' + req.query.district
    fetch(endpoint)
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
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