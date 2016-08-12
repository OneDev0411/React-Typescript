// actions/listings/get-valerts-alert.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, options) => {
  const params = {
    options,
    access_token: user.access_token
  }

  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.alerts_map)
        AppStore.data.alerts_map = {}
      AppStore.data.alerts_map.listings = response.data
      AppStore.data.current_alert.listings = response.data
      AppStore.data.alerts_map.listings_info = response.info
    }
    delete AppStore.data.alerts_map.is_loading
    // Get google geo
    if (!options.points) {
      const listing_locations = _.map(response.data, 'location')
      if (listing_locations.length) {
        const google = window.google
        const bound = new google.maps.LatLngBounds()
        listing_locations.forEach(listing_location => {
          bound.extend(new google.maps.LatLng(listing_location.latitude, listing_location.longitude))
        })
        const center = bound.getCenter()
        const lat = center.lat()
        const lng = center.lng()
        AppStore.data.listing_map.center = {
          lat,
          lng
        }
        window.map.fitBounds(bound)
      }
    }
    AppStore.emitChange()
    // Allow bounds change
    setTimeout(() => {
      delete AppStore.data.listing_map.auto_move
      AppStore.emitChange()
    }, 1000)
  })
}