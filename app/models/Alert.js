// models/Alert.js
import es6Promise from 'es6-promise'
es6Promise.polyfill()
import 'isomorphic-fetch'
import Fetch from '../services/fetch'
import config from '../../config/public'


const mappingStatus = status => {
  switch (status) {
    case 'New':
      return 'NEW LISTING'
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


export default {
  get: (params, callback) => {
    const endpoint = `/api/alerts/get-alert-room?room_id=${params.room_id}&alert_id=${params.alert_id}&access_token=${params.access_token}`
    fetch(endpoint)
      .then(response => {
        if (response.status >= 400) {
          const error = {
            status: 'error',
            response
          }
          return callback(error, false)
        }
        return response.json()
      })
      .then(response => callback(false, response))
  },
  getPaged: (params, callback) => {
    const endpoint = `/api/alerts/get-alert-room?room_id=${params.room_id}&alert_id=${params.alert_id}&access_token=${params.access_token}&timestamp=${params.timestamp}`
    fetch(endpoint)
      .then(response => {
        if (response.status >= 400) {
          const error = {
            status: 'error',
            response
          }
          return callback(error, false)
        }
        return response.json()
      })
      .then(response => callback(false, response))
  },
  getAll: (params, callback) => {
    const endpoint = `/api/alerts/get-alerts?access_token=${params.access_token}`
    fetch(endpoint)
      .then(response => {
        if (response.status >= 400) {
          const error = {
            status: 'error',
            response
          }
          return callback(error, false)
        }
        return response.json()
      })
      .then(response => callback(false, response))
  },
  acknowledgeNotifications: (params, callback) => {
    const alert = params.alert
    const endpoint = `/api/acknowledge-alert-notifications?access_token=${params.access_token}`
    const request_object = {
      alert
    }
    fetch(endpoint, {
      method: 'post',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(request_object)
    })
      .then(response => {
        if (response.status >= 400) {
          const error = {
            status: 'error',
            response
          }
          return callback(error, false)
        }
        return response.json()
      })
      .then(response => callback(false, response))
  },
  getFeed: async (alertId, roomId) => {
    if (!roomId || !alertId) {
      return
    }

    try {
      const response = await new Fetch()
        .get(`/rooms/${roomId}/recs/feed`)
        .query({ filter: alertId })
        .query({ sorting_value: 'Update' })
        .query({ limit: 200 })

      const { data } = response.body

      const listings = data.map(rec => ({
        ...rec.listing,
        numPoints: 1,
        recId: rec.id,
        recRoom: rec.room,
        list: rec.listing,
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
}
