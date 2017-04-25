// test/models-user-shadow.js
import { expect } from 'chai'
import User from '../app/models/User'
import config from '../config/private'

// Get access token
let access_token
let room_id
let test = config.test
const random_email = 'tony+' + (Math.random() * 10000).toFixed(0) + '@rechat.com'
const random_password = randomString(9)

// /* User
// ==================== */
describe('Testing User model', () => {
  // Create
  it('User.createShadow should return access token from UN: ' + random_email + ' PW: ' + random_password, function(done) {
    this.timeout(5000)
    const user = {
      first_name: random_email,
      email: random_email,
      user_type: 'Client',
      password: random_password,
      grant_type: 'password'
    }
    const params = {
      user,
      api_host: test.api_host
    }
    User.createShadow(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})

function randomString(len, charSet) {
  charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}
