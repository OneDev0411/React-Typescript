// api/posts/edit-favorite.js
module.exports = (app, config) => {
  app.post('/api/edit-favorite',(req, res) => {
    const api_url = config.api.url
    const room_id = req.body.room_id
    const rec_id = req.body.rec_id
    const favorite = req.body.favorite
    const endpoint = api_url + '/rooms/' + room_id + '/recs/' + rec_id + '/favorite'
    const access_token = req.body.access_token
    const request_object = {
      room_id,
      rec_id,
      favorite
    }
    fetch(endpoint, {
      method: 'patch',
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