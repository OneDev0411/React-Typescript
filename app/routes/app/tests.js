// tests.js
import Crypto from '../../models/Crypto'
import helpers from '../../utils/helpers'
module.exports = (app, config) => {
  // For testing purposes only
  app.get('/decrypt',(req, res) => {
    const decoded_token = decodeURIComponent(req.query.token)
    const decrypted_obj = JSON.parse(Crypto.decrypt(decoded_token))
    console.log(decrypted_obj)
    return res.end()
  })
  app.get('/test-phone',(req, res) => {
    var pnu = require('google-libphonenumber').PhoneNumberUtil.getInstance();
    console.log(pnu.formatNumberForMobileDialing('2141231234').toString())
  })
}