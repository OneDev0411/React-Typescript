// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
import Task from '../app/models/Task'
import config from '../config/private'

// Get access token
let access_token
let room_id
let contact_id
let test = config.test

/* Task
==================== */
describe('Testing Task model', () => {
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

  // Create transaction
  it('Task.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      title: 'Test Title',
      access_token,
      api_host: test.api_host
    }
    Task.create(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
  // // Get all transactions
  it('Task.getAll should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token,
      api_host: test.api_host
    }
    Task.getAll(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})