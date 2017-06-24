import Fetch from '../../../services/fetch'
import { normalize } from 'normalizr'
import * as schema from '../schema'

const __LIMIT__ = 200
const __SORTING_VALUE__ = 'Update'

const mappingStatus = status => {
  switch (status) {
    case 'NEW':
      return 'NEW LISTING'
    case 'PriceDrop':
      return 'PRICE DROP'
    case 'StatusChange':
      return 'STATUS CHANGE'
    case 'OpenHouseAvailable':
    default:
      return 'OPEN HOUSE'
  }
}

const getAlertListings = async ({ id, room }) => {
  if (!room || !id) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${room}/recs/feed`)
      .query({ filter: id })
      .query({ sorting_value: __SORTING_VALUE__ })
      .query({ limit: __LIMIT__ })

    const { data } = response.body

    const listings = data.map(rec => ({
      ...rec.listing,
      numPoints: 1,
      recId: rec.id,
      list: rec.listing,
      new: mappingStatus(rec.new),
      lat: rec.listing.property.address.location.latitude,
      lng: rec.listing.property.address.location.longitude
    }))

    let feed = {}
    feed[id] = listings

    return feed
  } catch (error) {
    throw error
  }
}

export default getAlertListings
