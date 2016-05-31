// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
import Alert from '../app/models/Alert'
import config from '../config/private'

// Get access token
let access_token
let test = config.test

/* Alert
==================== */
describe('Testing Alert model', () => {
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
  // Create room
  it('Alert.getAll should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token,
      api_host: test.api_host
    }
    Alert.getAll(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})