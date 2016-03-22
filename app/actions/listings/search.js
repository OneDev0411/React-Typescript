// actions/listings/search.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    q: q_commas,
    access_token: user.access_token
  }
  Listing.search(params, (err, response) => {
    // Success
    // New transaction
    if (AppStore.data.new_transaction) {
      if (response.status === 'success')
        AppStore.data.new_transaction.listings_found = response.data
      else
        delete AppStore.data.new_transaction.listings_found
      delete AppStore.data.new_transaction.listing_searching
      AppStore.data.new_transaction.listing_q = q
    }
    // Listing map
    if (AppStore.data.listing_map && AppStore.data.listing_map.is_loading) {
      const listings = response.data
      delete AppStore.data.listing_map.is_loading
      AppStore.data.listing_map.listings = listings
      // Center and zoom map on listing
      if (listings.length === 1) {
        const listing = listings[0]
        const lat = listing.location.latitude
        const lng = listing.location.longitude
        const map = window.map
        const google = window.google
        const zoom = 15
        AppStore.data.listing_map.center = {
          lat,
          lng
        }
        AppStore.data.listing_map.zoom = zoom
        AppStore.data.listing_map.auto_move = true
        AppStore.data.listing_map.active_listing = listing.id
        AppStore.emitChange()
        map.setCenter(new google.maps.LatLng(lat, lng))
        map.setZoom(zoom)
        setTimeout(() => {
          delete AppStore.data.listing_map.auto_move
          AppStore.emitChange()
        }, 3000)
      }
    }
    AppStore.emitChange()
  })
}