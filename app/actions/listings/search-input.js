// actions/listings/search-input.js
import Listing from '../../models/Listing'
import AppStore from '../../stores/AppStore'

export default (user, q) => {
  const q_commas = q.replace(/\s+/g, ',')
  const params = {
    q: q_commas
  }

  if (user) {
    params.access_token = user.access_token
  }

  Listing.search(params, async (err, response) => {
    try {
      const listings = await response
      if (Array.isArray(listings)) {
        const listings_info = {
          ...AppStore.data.listing_map.listings_info,
          type: 'search',
          count: listings.length,
          total: listings.length
        }
        const listing_map = {
          ...AppStore.data.listing_map,
          listings,
          listings_info,
          active_listing: listings[0].id
        }
        AppStore.data = {
          ...AppStore.data,
          listing_map
        }
        AppStore.emitChange()
      }
    } catch (error) {
      throw error
    }
  })
}