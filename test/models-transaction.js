// test/models-user.js
import { expect } from 'chai'
import User from '../app/models/User'
import Transaction from '../app/models/Transaction'
import config from '../config/private'

// Get access token
let access_token
let room_id
let contact_id
let test = config.test
let contacts

/* Transaction
==================== */
describe('Testing Transaction model', () => {
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

  // Get contacts
  it('User.getContacts should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token,
      api_host: test.api_host
    }
    User.getContacts(params, (err, response) => {
      contacts = response.data
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Create transaction
  it('Transaction.create should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const roles = [
      {
        contact: contacts[0].id,
        role_types: ['Other']
      }
    ]
    const params = {
      transaction_type: 'Buyer',
      title: 'Test Title',
      contract_price: 100000,
      roles: roles,
      access_token
    }
    Transaction.create(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
  // Get all transactions
  it('Transaction.getAll should return successful for user UN:' + test.user.email + ' PW:' + test.user.password, function(done) {
    const params = {
      access_token,
      api_host: test.api_host
    }
    Transaction.getAll(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})