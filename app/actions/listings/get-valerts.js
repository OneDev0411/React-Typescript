// actions/listings/get-valerts.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      AppStore.data.listing_map.listings = response.data
      AppStore.data.listing_map.listings_info = response.info
    }
    delete AppStore.data.listing_map.is_loading
    AppStore.emitChange()
  })
}