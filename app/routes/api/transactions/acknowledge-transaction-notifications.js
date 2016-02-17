// api/posts/acknowledge-transaction-notifications.js
module.exports = (app, config) => {
  app.post('/api/transactions/acknowledge-notifications',(req, res) => {
    const api_url = config.api.url
    const transaction = req.body.transaction
    const endpoint = api_url + '/transactions/' + transaction + '/notifications'
    const access_token = req.body.access_token
    fetch(endpoint,{
      method: 'delete',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
      }
    })
    .then(response => {
      if (response.status >= 400) {
        var error = {
          status: 'error',
          message: 'There was an error with this request.'
        }
        return res.json(error)
      }
      return response
    })
    .then(response => {
      let response_object = {}
      response_object.status = 'success'
      return res.json(response_object)
    })
  })
}