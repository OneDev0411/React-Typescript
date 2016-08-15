// actions/google/geocode-address.js
import AppStore from '../../stores/AppStore'
import Google from '../../models/Google'

export default (address) => {
  const params = {
    address
  }
  Google.geocodeAddress(params, (err, res) => {
    const geocode = res.results[0]
    // console.log(geocode) // 13362991
    if (!geocode)
      return
    const center = {
      lat: geocode.geometry.location.lat,
      lng: geocode.geometry.location.lng
    }
    AppStore.data.listing_map.center = center
    AppStore.data.listing_map.zoom = 16
    AppStore.data.listing_map.has_location_search = true
    AppStore.data.listing_map.location_search = {
      center
    }
    AppStore.emitChange()
  })
}