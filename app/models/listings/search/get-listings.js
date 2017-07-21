import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

export const byValert = async (options) => {
  if (!options) {
    return
  }

  try {
    const response = await new Fetch()
      .post('/valerts')
      .send(options)

    const { code, info, data } = response.body

    const listings = data.map(
      list => ({
        ...list,
        list,
        lat: list.location.latitude,
        lng: list.location.longitude
      })
    )

    const normilizedListings = normalize(listings, schema.listingsList)

    return {
      ...normilizedListings,
      info: {
        code,
        ...info
      }
    }
  } catch (error) {
    throw error
  }
}

export const byMlsNumber = async (mlsNumber) => {
  if (!mlsNumber) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/listings/search?mls_number=${mlsNumber}`)

    const { code, data } = response.body

    const lat = data.property.address.location.latitude
    const lng = data.property.address.location.longitude

    const listing = {
      ...data,
      numPoints: 1,
      list: data,
      lat,
      lng
    }

    const normilizedListings = normalize([listing], schema.listingsList)

    return {
      ...normilizedListings,
      info: {
        code,
        total: 1,
        count: 1,
        proposed_title: ''
      }
    }
  } catch (error) {
    throw error
  }
}