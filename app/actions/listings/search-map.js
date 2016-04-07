// actions/listings/search-map.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q, status) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    status,
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
    const zoom = 13
    AppStore.data.listing_map.auto_move = true
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
      AppStore.data.listing_map.active_listing = listing.id
      map.setCenter(new google.maps.LatLng(lat, lng))
      map.setZoom(zoom)
    } else {
      // Multiple listings
      const bounds = new google.maps.LatLngBounds()
      listings.forEach(listing => {
        if (listing && listing.location) {
          const location = new google.maps.LatLng(listing.location.latitude, listing.location.longitude)
          bounds.extend(location)
        }
      })
      map.fitBounds(bounds)
      const center = {
        lat: map.center.lat(),
        lng: map.center.lng()
      }
      AppStore.data.listing_map.center = center
    }
    setTimeout(() => {
      delete AppStore.data.listing_map.auto_move
      AppStore.emitChange()
    }, 4000)
    AppStore.data.listing_map.has_search_input = true
    AppStore.emitChange()
  })
}