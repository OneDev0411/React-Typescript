// api/listings/get-valerts.js
module.exports = (app, config) => {
  app.post('/api/listings/valerts',(req, res) => {
    const api_url = config.api.url
    let endpoint = api_url + '/valerts'
    const access_token = req.body.access_token
    const options = req.body.options
    // From map widget
    if (req.body.office && !options.list_offices) 
      endpoint = endpoint + '?associations=compact_listing.list_agent,compact_listing.list_office,compact_listing.selling_office,compact_listing.selling_agent&order_by=office,status&office=' + req.body.office
    // From listing widget
    if (options.list_offices && options.list_offices.length) {
      endpoint = endpoint + '?associations=compact_listing.list_agent'
      if (options.listing_statuses[0] === 'Sold')
        endpoint = endpoint + '&order_by=price'
    }
    // Offset
    if (req.body.offset)
      endpoint = endpoint + '&limit=75&offset=' + req.body.offset
    const headers = {  
      'Content-Type': 'application/json',
      'x-real-agent': req.headers['user-agent'],
      'user-agent': config.app_name
    }
    if (access_token)
      headers.authorization = 'Bearer ' + access_token
    fetch(endpoint,{
      method: 'post',
      headers,
      body: JSON.stringify(options)
    })
    .then(response => {
      if (response.status >= 400) {
        let error = {
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
    })
  })
}