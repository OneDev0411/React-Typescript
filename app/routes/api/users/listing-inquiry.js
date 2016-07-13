// api/posts/listing-inquiry.js
module.exports = (app, config) => {
  app.post('/api/user/listing-inquiry',(req, res) => {
    const access_token = req.body.access_token
    const agent = req.body.agent
    const listing = req.body.listing
    const brand = req.body.brand
    const source_type = req.body.source_type
    const api_url = config.api.url
    const endpoint = api_url + '/listings/' + listing + '/inquiry'
    const request_object = {
      agent,
      brand,
      source_type
    }
    fetch(endpoint,{
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent': req.headers['user-agent'],
        'user-agent': config.app_name
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          response
        }
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}