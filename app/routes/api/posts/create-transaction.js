// api/posts/create-transaction.js
module.exports = (app, config) => {
  
  app.post('/api/create-transaction',(req, res) => {

    const api_url = config.api.url
    const create_transaction_url = api_url + '/rooms/:id/transactions'

    const access_token = req.body.access_token

    // TBD
    // const request_object = {
    //   title: title,
    //   client_type: 'Unknown',
    //   room_type: 'Group',
    //   owner: owner
    // }

    // fetch(create_room_url,{
    //   method: 'post',
    //   headers: {  
    //     'Content-Type': 'application/json',
    //     'authorization': 'Bearer ' + access_token,
    //   },
    //   body: JSON.stringify(request_object)
    // })
    // .then(response => {
    //   if (response.status >= 400) {
    //     var error = {
    //       status: 'error',
    //       message: 'There was an error with this request.'
    //     }
    //     return res.json(error)
    //   }
    //   return response.json()
    // })
    // .then(response => {
    //   let response_object = response
    //   response_object.status = 'success'
    //   return res.json(response_object)
    // });
  })

}