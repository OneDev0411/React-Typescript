// test/models-rec.js
import { expect } from 'chai'
import User from '../app/models/User'
import Rec from '../app/models/Rec'
import config from '../config/private'

// Get access token
let access_token
let room_id
let test = config.test

/* User
==================== */
describe('Testing User model', () => {
  // Signin
  it('User.signin should return access token from UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      email: test.user.email,
      password: test.user.password,
      api_host: test.api_host
    }
    User.signin(params, (err, response) => {
      access_token = response.access_token
      test.user.id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Signin
  it('Rec.getActives should return successful', function(done) {
    const params = {
      access_token
    }
    Rec.getActives(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})
