// api/agents/search-agent.js
module.exports = (app, config) => {
  app.get('/api/agents/search',(req, res) => {
    const api_url = config.api.url
    const mlsid = req.query.mlsid
    const endpoint = api_url + '/agents/search?mlsid=' + mlsid
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