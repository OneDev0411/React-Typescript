// api/areas/search.js
module.exports = (app, config) => {
  app.get('/api/areas/search',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/areas/search?parents=' + req.query.parents + '&q=' + req.query.q
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