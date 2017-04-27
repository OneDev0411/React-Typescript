// actions/listings/get-valerts.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import { getParameterByName } from '../../utils/helpers'
export default (user, options) => {
  // Don't get listings if Mobile Splash page showing
  if (AppStore.data.show_mobile_splash_viewer)
    return
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  if (AppStore.data.brand) {
    let brokerage = getParameterByName('brokerage')
    if (!brokerage && AppStore.data.brand.offices)
      brokerage = AppStore.data.brand.offices[0].mls_id
    params.office = brokerage
  }
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      AppStore.data.listing_map.listings = response.data
      AppStore.data.listing_map.listings_info = response.info
    }
    delete AppStore.data.listing_map.is_loading
    // // If postal code search
    // if (options.postal_codes && options.postal_codes.length) {
    //   const listings = response.data
    //   const google = window.google
    //   const bound = new google.maps.LatLngBounds()
    //   listings.forEach(listing => {
    //     if (listing.location)
    //       bound.extend(new google.maps.LatLng(listing.location.latitude, listing.location.longitude))
    //   })
    //   const center_from_points = bound.getCenter()
    //   const center = {
    //     lat: center_from_points.lat(),
    //     lng: center_from_points.lng()
    //   }
    //   AppStore.data.listing_map.center = center
    //   AppStore.data.listing_map.zoom = 13
    // }
    AppStore.emitChange()
  })
}