// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
import Room from '../app/models/Room'
import Message from '../app/models/Message'
import config from '../config/private'

// Get access token
let access_token
let room_id
let test = config.test

/* Room
==================== */
describe('Testing Room model', () => {
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
  // it('Room.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     title: 'test title',
  //     owner: test.user.id,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   Room.create(params, (err, response) => {
  //     room_id = response.data.id
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Create message
  // it('Message.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     room_id: room_id,
  //     comment: 'Test message',
  //     message_type: 'TopLevel',
  //     author: test.user.id,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   Message.create(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // // Add user
  // it('Room.addUser should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     room_id: room_id,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   Room.addUser(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })

  // Add rec
  // it('Room.createRec should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     mls_number: '13315964',
  //     id: '64ee70d2-f1ef-11e5-bc3e-0242ac110006',
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   Room.createRec(params, (err, response) => {
  //     console.log(err)
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })
  // // Get actives
  // it('Room.getActives should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
  //   const params = {
  //     room_id: test.room_id,
  //     access_token,
  //     api_host: test.api_host
  //   }
  //   Room.getActives(params, (err, response) => {
  //     expect(response.status).to.equal('success')
  //     done()
  //   })
  // })
  // Get actives
  it('Room.editFavorite should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      room_id: test.room_id,
      rec_id: test.rec_id,
      favorite: test.favorite,
      access_token,
      api_host: test.api_host
    }
    Room.editFavorite(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})
