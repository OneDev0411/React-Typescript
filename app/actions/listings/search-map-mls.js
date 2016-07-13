// actions/listings/search-map-mls.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, mls_number, status) => {
  const params = {
    status,
    mls_number
  }
  if (user)
    params.access_token = user.access_token
  Listing.search(params, (err, response) => {
    // Listing map
    const listings = [response.data]
    const google = window.google
    const map = window.map
    delete AppStore.data.listing_map.is_loading
    AppStore.data.listing_map.listings = listings
    if (listings && listings.length) {
      AppStore.data.listing_map.listings_info = {
        total: listings.length
      }
    }
    const zoom = 13
    AppStore.data.listing_map.auto_move = true
    if (!listings || !listings.length) {
      delete AppStore.data.listing_map.auto_move
      AppStore.data.listing_map.no_listings_found = true
      AppStore.emitChange()
      return
    }
    // Center and zoom map on single listing MLS
    const listing = listings[0]
    const lat = listing.property.address.location.latitude
    const lng = listing.property.address.location.longitude
    AppStore.data.listing_map.center = {
      lat,
      lng
    }
    AppStore.data.listing_map.zoom = zoom
    AppStore.data.listing_map.active_listing = listing.id
    map.setCenter(new google.maps.LatLng(lat, lng))
    map.setZoom(zoom)
    setTimeout(() => {
      delete AppStore.data.listing_map.auto_move
      AppStore.emitChange()
    }, 4000)
    delete AppStore.data.listing_map.no_listings_found
    AppStore.data.listing_map.has_search_input = true
    AppStore.emitChange()
  })
}