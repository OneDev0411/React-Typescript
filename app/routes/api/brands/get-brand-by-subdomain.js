// api/brands/get-brand-by-subdomain.js
module.exports = (app, config) => {
  app.get('/api/brands/search',(req, res) => {
    const api_url = config.api.url
    const subdomain = req.query.subdomain
    const endpoint = api_url + '/brands/search?subdomain=' + subdomain
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