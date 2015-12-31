// api/posts/create-transaction.js
module.exports = (app, config) => {
  app.post('/api/create-transaction',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/transactions'
    const access_token = req.body.access_token
    const transaction_type = req.body.transaction_type
    const title = req.body.title
    const listing = req.body.listing
    const contract_price = req.body.contract_price
    const contacts = req.body.contacts
    const request_object = {
      transaction_type,
      title,
      listing,
      contract_price,
      contacts
    }
    fetch(endpoint,{
      method: 'post',
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
      let response_object = response
      response_object.status = 'success'
      return res.json(response_object)
    });
  })
}