// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
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
describe('Testing User model', () => {
  // Create
  // it('User.create should return access token from UN:' + random_email + ' PHONE: ' + random_phone + ' PW:' + test.user.password, function(done) {
  //   const user = {
  //     first_name: 'Test',
  //     last_name: 'User',
  //     email: random_email,
  //     user_type: 'Client',
  //     password: test.user.password,
  //     phone_number: random_phone,
  //     grant_type: 'password'
  //   }
  //   const params = {
  //     user,
  //     api_host: test.api_host
  //   }
  //   User.create(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

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

  // Edit
  // it('User.edit should return successful for user UN:' + random_email + ' PHONE: ' + random_phone + ' PW:' + test.user.password, function(done) {
  //   const user = {
  //     first_name: 'New Test First',
  //     last_name: 'New User Last',
  //     email: randomString(9) + '@rechat.co',
  //     phone_number: random_phone
  //   }
  //   const params = {
  //     user,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   User.edit(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Forgot password
  // it('User.forgotPassword should return successful for user email:' + test.user.email, function(done) {
  //   const params = {
  //     email: test.user.email,
  //     api_host: test.api_host
  //   }
  //   User.forgotPassword(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Get rooms
  // it('User.getRooms should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   User.getRooms(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Create contact
  // it('User.createContacts should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     contacts: test.contacts,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   User.createContacts(params, (err, response) => {
  //     contact_id = response.data[0].id
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Get contacts
  // it('User.getContacts should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   User.getContacts(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // Get favorites
  // it('User.getFavorites should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   User.getFavorites(params, (err, response) => {
  //     console.log(response)
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })
  // Get all
  it('User.search should users', function(done) {
    const params = {
      access_token: access_token,
      q: 'Tony'
    }
    User.search(params, (err, response) => {
      console.log(response)
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