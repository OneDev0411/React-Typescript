// AppDispatcher.js
import { Dispatcher } from 'flux'

// Listings
import searchListingTransaction from '../actions/listings/search-transaction'
import searchListingMap from '../actions/listings/search-map'
import getSimilarListings from '../actions/listings/get-similars'
import getValerts from '../actions/listings/get-valerts'
import getListing from '../actions/listings/get-listing'
import shareAlert from '../actions/alerts/share-alert'
import getAlert from '../actions/alerts/get-alert'
import shareListing from '../actions/listings/share-listing'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => {
  const action = payload.action
  switch (action) {

    case 'search-listing-transaction':
      searchListingTransaction(payload.user, payload.q)
      break

    case 'search-listing-map':
      searchListingMap(payload.user, payload.q)
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
      shareAlert(payload.user, payload.rooms, payload.contacts, payload.emails, payload.phone_numbers, payload.alert)
      break

    case 'get-alert':
      getAlert(payload.user, payload.room_id, payload.alert_id)
      break

    case 'share-listing':
      shareListing(payload.user, payload.mls_number, payload.message, payload.rooms, payload.users, payload.emails, payload.notification)
      break

    default:
      return true
  }
  return true
})

export default ListingDispatcher