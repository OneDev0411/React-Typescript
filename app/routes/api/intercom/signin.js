// api/intercom/signin.js
module.exports = (app, config) => {
  const Intercom = require('intercom-client')
  const client = new Intercom.Client({appId:config.intercom.app_id, appApiKey:config.intercom.secret_key})
  console.log(config.intercom.app_id, config.intercom.secret_key)
  const inspect = require('util').inspect

  app.post('/api/intercom/signin', (req, res) => {
    const user = req.body.user
    const intercom_user = {
      user_id:user.id,
      email: user.email,
      name: user.first_name + ' ' + user.last_name,
      update_last_request_at:true,
      created_at:user.created_at,
      updated_at:user.update_at,
      last_seen_ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress
    }
    client.users.create(intercom_user, r => {})
  })
}