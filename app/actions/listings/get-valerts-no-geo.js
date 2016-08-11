// actions/listings/get-valerts.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  if (AppStore.data.brand)
    params.office = AppStore.data.brand.office_mls_id
  console.log('get-valerts-no-geo')
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      AppStore.data.listing_map.listings = response.data
      AppStore.data.listing_map.listings_info = response.info
    }
    delete AppStore.data.listing_map.is_loading
    // Get google geo
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
    AppStore.emitChange()
  })
}