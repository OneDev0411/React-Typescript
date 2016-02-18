// test/models-listing.js
import { expect } from 'chai'
import User from '../app/models/User'
import Listing from '../app/models/Listing'
import config from '../config/private'

// Get access token
let access_token
let room_id
let contact_id
let test = config.test
const test_options = {
  "maximum_price": 9.223372036854776e+18,
  "limit": "75",
  "maximum_lot_square_meters": 8.568721699047544e+17,
  "minimum_bathrooms": 1,
  "maximum_square_meters": 8.568721699047544e+17,
  "location": {
    "longitude": -96.79698789999998,
    "latitude": 32.7766642
  },
  "horizontal_distance": 2830,
  "property_type": "Residential",
  "vertical_distance": 2830,
  "minimum_square_meters": 0,
  "listing_statuses": ["Active", "Active Contingent", "Active Kick Out", "Active Option Contract"],
  "minimum_lot_square_meters": 0,
  "currency": "USD",
  "maximum_year_built": 2016,
  "minimum_year_built": 0,
  "points": [{
    "longitude": -96.81209123485418,
    "latitude": 32.79969676454082
  }, {
    "longitude": -96.78188456514575,
    "latitude": 32.79969676454082
  }, {
    "longitude": -96.78188456514575,
    "latitude": 32.75454610060654
  }, {
    "longitude": -96.81209123485418,
    "latitude": 32.75454610060654
  }, {
    "longitude": -96.81209123485418,
    "latitude": 32.79969676454082
  }],
  "minimum_bedrooms": 0,
  "minimum_price": 0,
  "open_house": false,
  "property_subtypes": ["RES-Single Family", "RES-Half Duplex", "RES-Farm\/Ranch", "RES-Condo", "RES-Townhouse"]
}

/* Listing
==================== */
describe('Testing Listing model', () => { 
  
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

  // Search Listing
  it('Listing.get should return successful for search query: ' + test.listing.search_q, function(done) {
    const params = {
      id: test.listing.id,
      access_token,
      api_host: test.api_host
    }
    Listing.get(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Search Listing
  it('Listing.search should return successful for search query: ' + test.listing.search_q, function(done) {
    const params = {
      q: test.listing.search_q,
      access_token,
      api_host: test.api_host
    }
    Listing.search(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })

  // Listing Valerts
  it('Listing.getValerts should return successful', function(done) {
    const params = {
      access_token,
      options: test_options
    }
    Listing.getValerts(params, (err, response) => {
      expect(response.status).to.equal('success')
      done()
    })
  })
})