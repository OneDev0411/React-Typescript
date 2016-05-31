// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
import Alert from '../app/models/Room'
import config from '../config/private'

// Get access token
let access_token
let room_id
let contact_id
let test = config.test

/* Room
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
      const access_token = response.access_token
      test.user.id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  })
  // Create room
  it('Alert.get should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      room_id: test.room_id,
      alert_id: test.alert_id,
      access_token,
      api_host: test.api_host
    }
    Alert.get(params, (err, response) => {
      room_id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  })
})