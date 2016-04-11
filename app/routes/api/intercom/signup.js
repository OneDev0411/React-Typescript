// api/intercom/signup.js
module.exports = (app, config) => {
  const Intercom = require('intercom-client')
  const client = new Intercom.Client(config.intercom.app_id, config.intercom.secret_key)
  app.post('/api/intercom/signup', (req, res) => {
    const user = req.body.user
    const intercom_user = {
      user_id: user.id,
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      update_last_request_at: true,
      created_at: user.created_at,
      updated_at: user.update_at,
      last_seen_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }
    client.users.create(intercom_user, r => {})
    res.end(true)
  })
}