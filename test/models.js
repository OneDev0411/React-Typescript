// test/models.js
import { expect } from 'chai'
import User from '../app/models/User'
import Room from '../app/models/Room'
import Message from '../app/models/Message'
import Listing from '../app/models/Listing'
import Transaction from '../app/models/Transaction'
import Task from '../app/models/Task'
import config from '../config/private'

// Get access token
let access_token
let room_id
let contact_id
let test = config.test
const random_email = randomString(9) + '@rechat.co'
const random_phone = Math.floor(Math.random() * 1000000000)

/* User
==================== */
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
    const params = {
      user: user,
      api_host: test.api_host
    }
    User.create(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

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

  // Forgot password
  it('User.forgotPassword should return successful for user email:' + test.user.email, function(done) {
    const params = {
      email: test.user.email,
      api_host: test.api_host
    }
    User.forgotPassword(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Get rooms
  it('User.getRooms should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token: access_token,
      api_host: test.api_host
    }
    User.getRooms(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Create contact
  it('User.createContacts should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      contacts: test.contacts,
      access_token: access_token,
      api_host: test.api_host
    }
    User.createContacts(params, (err, response) => {
      contact_id = response.data[0].id
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Get contacts
  it('User.getContacts should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token: access_token,
      api_host: test.api_host
    }
    User.getContacts(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})

/* Room
==================== */
describe('Testing Room model', function() { 
  // Create room
  it('Room.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      title: 'test title',
      owner: test.user.id,
      access_token: access_token,
      api_host: test.api_host
    }
    Room.create(params, (err, response) => {
      room_id = response.data.id
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Create message
  it('Message.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      room_id: room_id,
      comment: 'Test message',
      message_type: 'TopLevel',
      author: test.user.id,
      access_token: access_token,
      api_host: test.api_host
    }
    Message.create(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Add user
  it('Room.addUser should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      room_id: room_id,
      user: contact_id,
      access_token: access_token,
      api_host: test.api_host
    }
    Room.addUser(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})

/* Listing
==================== */
describe('Testing Listing model', function() { 
  // Search Listing
  it('Listing.search should return successful for search query: ' + test.listing.search_q, function(done) {
    const params = {
      q: test.listing.search_q,
      access_token: access_token,
      api_host: test.api_host
    }
    Listing.search(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})

/* Transaction
==================== */
describe('Testing Transaction model', function() { 
  // Create transaction
  it('Transaction.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      transaction_type: 'Buyer',
      title: 'Test Title',
      access_token: access_token,
      api_host: test.api_host
    }
    Transaction.create(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
  // Get all transactions
  it('Transaction.getAll should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token: access_token,
      api_host: test.api_host
    }
    Transaction.getAll(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})

/* Task
==================== */
describe('Testing Task model', function() { 
  // Create transaction
  it('Task.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      title: 'Test Title',
      access_token: access_token,
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
      access_token: access_token,
      api_host: test.api_host
    }
    Task.getAll(params, (err, response) => {
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