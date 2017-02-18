// api/alerts/get-alert.js
module.exports = (app, config) => {
  app.get('/api/brands/deals',(req, res) => {
    const api_url = config.api.url
    const brand_id = req.query.brand_id
    const access_token = req.query.access_token
    const endpoint = api_url + '/brands/' + brand_id + '/deals'
    fetch(endpoint,{
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      }
    })
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
