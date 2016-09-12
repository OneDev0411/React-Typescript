// api/brands/get-brand-by-hostname.js
module.exports = (app, config) => {
  app.get('/api/brands/search',(req, res) => {
    const api_url = config.api.url
    const hostname = req.query.hostname
    const endpoint = api_url + '/brands/search?hostname=' + hostname
    fetch(endpoint)
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