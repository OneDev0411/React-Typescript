// actions/listings/search.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const params = {
    q,
    access_token: user.access_token
  }
  Listing.search(params, (err, response) => {
    // Success
    if (response.status === 'success')
      AppStore.data.new_transaction.listings_found = response.data
    else
      delete AppStore.data.new_transaction.listings_found
    delete AppStore.data.new_transaction.listing_searching
    AppStore.data.new_transaction.listing_q = q
    AppStore.emitChange()
  })
}