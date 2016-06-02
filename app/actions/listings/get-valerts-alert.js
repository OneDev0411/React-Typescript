// actions/listings/get-valerts-alert.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

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
      AppStore.data.alerts_map.listings_info = response.info
    }
    delete AppStore.data.alerts_map.is_loading
    AppStore.emitChange()
  })
}