const request = require('request')

module.exports = (app, config) => {
  app.get('/api/deals/envelope/preview',(req, res) => {
    const api_url = config.api.url
    const envelope_id = req.query.id
    const envelope_index = req.query.index
    const access_token = req.query.access_token
    const file_name = envelope_id + '_' + envelope_index + '.pdf'
    const endpoint = api_url + '/envelopes/' + envelope_id + '/' + envelope_index + '.pdf'

    console.log(endpoint)
    console.log(access_token)

    request({
      url: endpoint,
      headers: {
        'authorization': 'Bearer ' + access_token,
      }
    })
    .on('response', function(response) {
      if (response.statusCode >= 400) {
        var error = {
          status: 'error',
          response
        }
        return res.json(error)
      }
    })
    .pipe(res)
  })
}
