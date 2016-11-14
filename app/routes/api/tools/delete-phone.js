// api/tools/delete-phone.js
module.exports = (app, config) => {
  app.delete('/api/tools/delete-phone',(req, res) => {
    const api_url = config.api.url
    const endpoint = api_url + '/admin/users/phone?q=' + encodeURIComponent(req.query.phone_number)
    fetch(endpoint,{
      method: 'delete',
    })
    .then(response => {
      if (response.status >= 400) {
        const error = {
          status: 'error',
          response
        }
        return callback(error, false)
      }
      return response
    })
    .then(response => {
      return res.send('done')
    })
  })
}