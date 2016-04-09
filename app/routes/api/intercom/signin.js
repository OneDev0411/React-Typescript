// api/intercom/signin.js
module.exports = (app, config) => {
  const Intercom = require('intercom-client')
  const client = new Intercom.Client(config.intercom.app_id, config.intercom.secret_key)
  app.post('/api/intercom/signin', (req, res) => {
    const user = req.body.user
    const intercom_user = {
      email: user.email,
      name: user.first_name + ' ' + user.last_name
    } 
    client.users.create(intercom_user, r => {
      // console.log(r.headers.status)
    })
  })
}