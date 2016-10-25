// api/listings/search-listings.js
module.exports = (app, config) => {
  app.get('/api/listings/search',(req, res) => {
    const api_url = config.api.url
    const query_array = req.query.q.split(',')
    let query_string = ''
    query_array.forEach(string => {
      if (!query_string)
        query_string = 'q[]=' + string
      else
        query_string += '&q[]=' + string
    })
    let endpoint = api_url + '/listings/search?' + query_string
    const access_token = req.query.access_token
    const headers = {  
      'Content-Type': 'application/json',
      'x-real-agent': req.headers['user-agent'],
      'user-agent': config.app_name
    }
    if (access_token)
      headers.authorization = 'Bearer ' + access_token
    fetch(endpoint, {
      method: 'get',
      headers
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