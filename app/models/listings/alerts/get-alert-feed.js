import Fetch from '../../../services/fetch'

const __LIMIT__ = 500
const __SORTING_VALUE__ = 'Update'

const mappingStatus = status => {
  switch (status) {
    case 'New':
      return 'Have not Seen'
    case 'PriceDrop':
      return 'PRICE DROP'
    case 'StatusChange':
      return 'STATUS CHANGE'
    case 'OpenHouseAvailable':
      return 'OPEN HOUSE'
    default:
      return ''
  }
}

const getAlertFeed = async (alertId, roomId) => {
  if (!roomId || !alertId) {
    return
  }

  try {
    const response = await new Fetch()
      .get(`/rooms/${roomId}/recs/feed`)
      .query({ filter: alertId })
      .query({ sorting_value: __SORTING_VALUE__ })
      .query({ limit: __LIMIT__ })

    const { data } = response.body

    const listings = data.map(rec => ({
      ...rec.listing,
      recId: rec.id,
      recRoom: rec.room,
      new: mappingStatus(rec.last_update),
      lat: rec.listing.property.address.location.latitude,
      lng: rec.listing.property.address.location.longitude
    }))

    let feed = {}
    feed[alertId] = listings

    return feed
  } catch (error) {
    throw error
  }
}

export default getAlertFeed
