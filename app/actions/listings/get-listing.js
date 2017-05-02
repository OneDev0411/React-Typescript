// actions/listings/get-listing.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, id) => {
  const params = { id }

  if (user)
    params.user = user.access_token

  Listing.get(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      AppStore.data.current_listing = response.data
      AppStore.data.show_listing_viewer = true
      AppStore.emitChange()
    }
  })
}
