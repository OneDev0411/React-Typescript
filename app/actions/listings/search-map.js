// actions/listings/search-map.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    q: q_commas,
    access_token: user.access_token
  }
  Listing.search(params, (err, response) => {
    // Listing map
    const listings = response.data
    const google = window.google
    const map = window.map
    delete AppStore.data.listing_map.is_loading
    AppStore.data.listing_map.listings = listings
    const zoom = 10
    // Center and zoom map on single listing MLS
    if (listings.length === 1) {
      const listing = listings[0]
      const lat = listing.location.latitude
      const lng = listing.location.longitude
      AppStore.data.listing_map.center = {
        lat,
        lng
      }
      AppStore.data.listing_map.zoom = zoom
      AppStore.data.listing_map.auto_move = true
      AppStore.data.listing_map.active_listing = listing.id
      map.setCenter(new google.maps.LatLng(lat, lng))
      map.setZoom(zoom)
    } else {
      // Multiple listings
      const geocoder = new google.maps.Geocoder
      geocoder.geocode({ 'address': q_commas }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const lat = results[0].geometry.location.lat()
          const lng = results[0].geometry.location.lng()
          AppStore.data.listing_map.center = {
            lat,
            lng
          }
          AppStore.data.listing_map.zoom = zoom
          AppStore.data.listing_map.auto_move = true
          map.setZoom(zoom)
          window.map.setCenter(results[0].geometry.location)
          AppStore.emitChange()
        } // else
        // console.log('Geocode was not successful for the following reason: ' + status)
      })
    }
    setTimeout(() => {
      delete AppStore.data.listing_map.auto_move
      AppStore.emitChange()
    }, 3000)
    AppStore.emitChange()
  })
}