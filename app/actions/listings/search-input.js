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
    if (response.status === 'success')
      AppStore.data.search_input.listings = response.data
    AppStore.emitChange()
  })
}