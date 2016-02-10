// actions/listings/get-similars.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, mls_number) => {
  const params = {
    mls_number,
    access_token: user.access_token
  }
  Listing.getSimilars(params, (err, response) => {
    AppStore.data.similar_listings = {};
    
    // Success
    if (response.status === 'success')
      AppStore.data.similar_listings.listings = response.data
    else
      delete AppStore.data.similar_listings.listings;

    AppStore.emitChange()
  })
}