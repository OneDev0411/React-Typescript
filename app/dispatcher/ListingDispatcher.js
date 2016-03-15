// AppDispatcher.js
import { Dispatcher } from 'flux'

// Listings
import searchListing from '../actions/listings/search'
import getSimilarListings from '../actions/listings/get-similars'
import getValerts from '../actions/listings/get-valerts'
import getListing from '../actions/listings/get-listing'
import shareAlert from '../actions/listings/share-alert'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => {
  const action = payload.action
  switch (action) {

    case 'search-listing':
      searchListing(payload.user, payload.q)
      break

    case 'get-similar-listings':
      getSimilarListings(payload.user, payload.mls_number)
      break

    case 'get-valerts':
      getValerts(payload.user, payload.options)
      break

    case 'get-listing':
      getListing(payload.user, payload.id)
      break

    case 'share-alert':
      shareAlert(payload.user, payload.id, payload.alert)
      break

    default:
      return true
  }
  return true
})

export default ListingDispatcher