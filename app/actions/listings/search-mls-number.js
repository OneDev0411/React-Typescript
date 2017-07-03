// actions/listings/search-mls-number.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q, status) => {
  const params = {
    status,
    q: q.replace(/\s+/g, ',')
  }
  if (user) {
    params.access_token = user.access_token
  }

  Listing.getMlsNumber(params, async (err, response) => {
    // Listing map
    try {
      let listings = await response

      if (!Array.isArray(listings)) {
        listings = [listings]
      }

      // If mls_number, put in array
      const google = window.google
      const map = window.map

      delete AppStore.data.listing_map.is_loading
      AppStore.data.listing_map.listings = listings

      if (listings && listings.length) {
        AppStore.data.listing_map.listings_info = {
          total: listings.length
        }
      }

      const zoom = 15

      AppStore.data.listing_map.auto_move = true
      if (!listings || !listings.length) {
        delete AppStore.data.listing_map.auto_move
        AppStore.data.listing_map.no_listings_found = true
        AppStore.emitChange()
        return
      }

      // Center and zoom map on single listing MLS
      if (listings.length === 1) {
        const listing = listings[0]
        let lat = null
        let lng = null

        let location = listing.location
        if (location) {
          lat = location.latitude
          lng = location.longitude
        } else if (listing.property && listing.property.address.location) {
          lat = listing.property.address.location.latitude
          lng = listing.property.address.location.longitude
          location = listing.property.address.location
        }
        AppStore.data.listing_map.center = {
          lat,
          lng
        }
        listings[0] = {
          ...listing,
          location
        }
        AppStore.data.listing_map.zoom = zoom
        AppStore.data.listing_map.active_listing = listing.id
        map.setCenter(new google.maps.LatLng(lat, lng))
        map.setZoom(zoom)
      } else {
        // Multiple listings
        const bounds = new google.maps.LatLngBounds()
        listings.forEach((listing) => {
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

      setTimeout(() => {
        delete AppStore.data.listing_map.active_listing
        AppStore.emitChange()
      }, 6000)

      delete AppStore.data.listing_map.no_listings_found
      AppStore.data.listing_map.has_search_input = true
      AppStore.emitChange()
    } catch (error) {
      throw error
    }
  })
}
