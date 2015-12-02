// test/models.js
import { expect } from 'chai'
import User from '../app/models/User'
import Room from '../app/models/Room'
import config from '../config/private'

describe('Testing models', function() {
  
  // Get access token
  let access_token
  let user_id
  let test_user = config.test.user

  before(function(done){
    
    User.signin(test_user.email,test_user.password, (err, response) => {
      expect(response.status).to.equal('success')
      access_token = response.access_token
      test_user.id = response.data.id
      done()
    })
  })

  /* User
  ======================== */
  // Signin
  it('User.signin should return access token from UN:' + test_user.email + ' PW:' + test_user.password, function(done) {
    
    User.signin('tony@rechat.co','testpass', (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  
  });

  // Forgot password
  it('User.forgotPassword should return successful for user email:' + test_user.email, function(done) {
    User.forgotPassword(test_user.email, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  });

  // Get rooms
  it('User.getRooms should return successful for user UN:' + test_user.email + ' PW:' + test_user.password, function(done) {
    User.getRooms(access_token, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  });

  /* Rooms
  ======================== */
  // Create room
  it('Room.create should return successful for user UN:' + test_user.email + ' PW:' + test_user.password, function(done) {
    
    Room.create('test title', test_user.id, access_token, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  
  });

});