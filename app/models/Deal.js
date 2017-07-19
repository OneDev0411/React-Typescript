import agent from 'superagent'
import _ from 'underscore'
import config from '../../config/public'
import Fetch from '../services/fetch'


const Deal = {
  get: {}
}

/**
* a helper that extracts a field from context or proposed values
*/
Deal.get.field = function(deal, field) {
  if (deal.context && deal.context[field]) {
    return deal.context[field]
  } else if (deal.proposed_values && deal.proposed_values[field]) {
    return deal.proposed_values[field]
  } else {
    return ''
  }
}

/**
* a helper that extracts address from deal
*/
Deal.get.address = function(deal) {
  const street_name = Deal.get.field(deal, 'street_name')
  const street_address = Deal.get.field(deal, 'street_address')

  return (street_name + ' ' + street_address).trim()
}


/**
* get deals list
*/
Deal.getAll = async function(user = {}) {
  const { access_token } = user

  try {
    const fetchDeals = new Fetch()
      .get('/deals')

    // required on ssr
    if (access_token) {
      fetchDeals.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchDeals
    return response.body.data

  } catch (e) {
    console.log(e)
  }
}

/**
* search google places
*/
Deal.searchPlaces = async function(address) {
  try {
    const params = `address=${address}&region=us&components=administrative_area:texas` +
      `&key=${config.google.api_key}`

    const response = await agent
      .get(`https://maps.googleapis.com/maps/api/geocode/json?${params}`)

    return response.body
  }
  catch(e) {
    throw e
  }
}

/**
* search listings
*/
Deal.searchListings = async function (address) {
  try {
    const response = await new Fetch()
      .get(`/listings/search?q=${address}`)

    return response.body
  }
  catch(e) {
    throw e
  }
}

/**
* create new deal
*/
Deal.create = async function (data) {

  try {
    const response = await new Fetch()
      .post('/deals')
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}


export default Deal
