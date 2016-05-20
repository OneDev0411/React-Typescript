// actions/listings/get-similars.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, options) => {
  const params = {
    options,
    access_token: user.access_token
  }

  Listing.getValerts(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      if (!AppStore.data.listing_map.listings || !AppStore.data.listing_map.listings.length)
        AppStore.data.listing_map.listings = response.data
      else {
        const listings = response.data
        const new_listings = listings.filter(listing => {
          return !_.find(AppStore.data.listing_map.listings, { id: listing.id })
        })
        AppStore.data.listing_map.listings = [
          ...AppStore.data.listing_map.listings,
          ...new_listings
        ]
      }
      AppStore.data.listing_map.listings_info = response.info
    }
    delete AppStore.data.listing_map.is_loading
    AppStore.emitChange()
  })
}