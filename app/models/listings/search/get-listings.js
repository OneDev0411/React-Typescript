import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const prepareListignsForMap = listings =>
  listings.map(list => ({
    ...list,
    list,
    lat: list.location.latitude,
    lng: list.location.longitude
  }))

const normilizedResponse = (response) => {
  const { code, info, data } = response.body
  const listings = prepareListignsForMap(data)
  const normilizedListings = normalize(listings, schema.listingsList)

  return {
    ...normilizedListings,
    info: {
      code,
      ...info
    }
  }
}

export const byValert = async (options) => {
  if (!options) {
    return
  }

  try {
    const response = await new Fetch()
      .post('/valerts')
      .send(options)

    return normilizedResponse(response)
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
      .post(`/listings/search?mls_number=${mlsNumber}`)
      .send(options)

    return normilizedResponse(response)
  } catch (error) {
    throw error
  }
}