// api/brands/get-brand-by-hostname.js
module.exports = (app, config) => {
  app.get('/api/brands/search',(req, res) => {
    const api_url = config.api.url
    const hostname = req.query.hostname
    const access_token = req.query.access_token
    const endpoint = api_url + '/brands/search?hostname=' + hostname

    const headers = {
      'x-real-agent': req.headers['user-agent'],
      'user-agent': config.app_name
    }

    if (access_token)
      headers.authorization = 'Bearer ' + access_token

    fetch(endpoint, {headers})
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