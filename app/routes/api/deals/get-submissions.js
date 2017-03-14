module.exports = (app, config) => {
  app.get('/api/deals/submissions',(req, res) => {
    const api_url = config.api.url
    const deal_id = req.query.deal_id
    const access_token = req.query.access_token
    const endpoint = api_url + '/deals/' + deal_id + '/submissions'

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
