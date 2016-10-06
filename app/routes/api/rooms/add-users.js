// api/rooms/add-users.js
// module.exports = (app, config) => {
//   app.post('/api/rooms/add-users', (req, res) => {
//     const api_url = config.api.url
//     const room_id = req.body.room_id
//     const endpoint = api_url + '/rooms/' + room_id + '/users'
//     const users = req.body.users
//     const emails = req.body.emails
//     const phone_numbers = req.body.phone_numbers
//     const access_token = req.body.access_token
//     const request_object = {
//       user: users,
//       emails,
//       phone_numbers
//     }
//     fetch(endpoint, {
//       method: 'post',
//       headers: {  
//         'Content-Type': 'application/json',
//         'authorization': 'Bearer ' + access_token,
//         'x-real-agent': req.headers['user-agent'],
//         'user-agent': config.app_name
//       },
//       body: JSON.stringify(request_object)
//     })
//     .then(response => {
//       if (response.status >= 400) {
//         var error = {
//           status: 'error',
//           response
//         }
//         return res.json(error)
//       }
//       return response.json()
//     })
//     .then(response => {
//       let response_object = response
//       response_object.status = 'success'
//       return res.json(response_object)
//     });
//   })
// }

// api/rooms/add-users.js
module.exports = (app, config) => {
  app.post('/api/rooms/add-users', (req, res) => {
    const api_url = config.api.url
    const room_id = req.body.room_id
    const endpoint = api_url + '/invitations'
    const users = req.body.users
    const emails = req.body.emails
    const phone_numbers = req.body.phone_numbers
    const access_token = req.body.access_token
    const inviting_user = req.body.inviting_user
    const invitations = []
    users.forEach(invited_user => invitations.push({
      invited_user,
      inviting_user,
      room: room_id,
    }))
    emails.forEach(email => invitations.push({
      email,
      inviting_user,
      room: room_id,
    }))
    phone_numbers.forEach(phone_number => invitations.push({
      phone_number,
      inviting_user,
      room: room_id,
    }))
    const request_object = {
      invitations
    }
    fetch(endpoint, {
      method: 'post',
      headers: {  
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + access_token,
        'x-real-agent': req.headers['user-agent'],
        'user-agent': config.app_name
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