// api/posts/edit-transaction.js
module.exports = (app, config) => {
  app.post('/api/edit-transaction',(req, res) => {
    const api_url = config.api.url
    const id = req.query.id
    const endpoint = api_url + '/transactions/' + id
    const access_token = req.body.access_token
    const listing_data = req.body.listing_data
    const transaction_type = req.body.transaction_type
    const user = req.body.user
    const request_object = {
      transaction_type,
      listing_data,
      user
    }
    fetch(endpoint,{
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      },
      body: JSON.stringify(request_object)
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return res.json(error)
      }
      return response.json()
    })
    .then(response => {
      response.status = 'success'
      return res.json(response)
    });
  })
}