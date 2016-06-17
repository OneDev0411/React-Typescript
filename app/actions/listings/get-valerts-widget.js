// actions/listings/get-valerts-widget.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
export default (user, options) => {
  const params = {
    options
  }
  if (user)
    params.access_token = user.access_token
  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.widget)
        AppStore.data.widget = {}
      AppStore.data.widget.listings = _.slice(response.data, 0, 10)
      AppStore.data.widget.listings_info = response.info
    }
    delete AppStore.data.widget.is_loading
    delete AppStore.data.widget.is_loading_listings
    AppStore.emitChange()
  })
}