// actions/listings/search-input.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    q: q_commas
  }
  if (user)
    params.access_token = user.access_token
  Listing.search(params, (err, response) => {
    // Success
    if (response && response.status === 'success' && response.data.length === 1) {
      AppStore.data.listing_map.listings = response.data
      AppStore.data.listing_map.active_listing = response.data[0].id
    }
    AppStore.emitChange()
  })
}