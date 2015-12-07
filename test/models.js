// test/models.js
import { expect } from 'chai'
import User from '../app/models/User'
import Room from '../app/models/Room'
import Message from '../app/models/Message'
import config from '../config'

// Get access token
let access_token
let room_id
let test = config.test
const random_email = randomString(9) + '@rechat.co'
const random_phone = Math.floor(Math.random() * 1000000000)

describe('Testing User model', function() {
  
  // Create
  it('User.create should return access token from UN:' + random_email + ' PHONE: ' + random_phone + ' PW:' + test.user.password, function(done) {
    const user = {
      first_name: 'Test',
      last_name: 'User',
      email: random_email,
      user_type: 'Client',
      password: test.user.password,
      phone_number: random_phone,
      grant_type: 'password'
    }
    const create_params = {
      user: user,
      api_host: test.api_host
    }
    User.create(create_params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  });

  // Signin
  it('User.signin should return access token from UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const signin_params = {
      email: test.user.email,
      password: test.user.password,
      api_host: test.api_host
    }
    User.signin(signin_params, (err, response) => {
      access_token = response.access_token
      test.user.id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  });

  // Forgot password
  it('User.forgotPassword should return successful for user email:' + test.user.email, function(done) {
    const forgot_params = {
      email: test.user.email,
      api_host: test.api_host
    }
    User.forgotPassword(forgot_params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  });

  // Get rooms
  it('User.getRooms should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const get_rooms_params = {
      access_token: access_token,
      api_host: test.api_host
    }
    User.getRooms(get_rooms_params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  });

})

describe('Testing Room model', function() {
  
  // Create room
  it('Room.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const create_room_params = {
      title: 'test title',
      owner: test.user.id,
      access_token: access_token,
      api_host: test.api_host
    }
    Room.create(create_room_params, (err, response) => {
      room_id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Create message
  it('Message.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const create_message_params = {
      room_id: room_id,
      comment: 'Test message',
      message_type: 'TopLevel',
      author: test.user.id,
      access_token: access_token
    }
    Message.create(create_message_params, (err, response) => {
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