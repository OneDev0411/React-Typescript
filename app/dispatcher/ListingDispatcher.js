// ListingDispatcher.js
import { Dispatcher } from 'flux'

// Listings
import searchListingTransaction from '../actions/listings/search-transaction'
import searchListingMap from '../actions/listings/search-map'
import searchListingWidget from '../actions/listings/search-widget'
import searchListingInput from '../actions/listings/search-input'
import getSimilarListings from '../actions/listings/get-similars'
import getValerts from '../actions/listings/get-valerts'
import getValertsAlert from '../actions/listings/get-valerts-alert'
import getListing from '../actions/listings/get-listing'
import shareAlert from '../actions/alerts/share-alert'
import getAlertRoom from '../actions/alerts/get-alert-room'
import getAlertMap from '../actions/alerts/get-alert-map'
import getAlerts from '../actions/alerts/get-alerts'
import shareListing from '../actions/listings/share-listing'
import editFavorite from '../actions/rooms/edit-favorite'
import getActives from '../actions/recs/get-actives'
import getFavorites from '../actions/user/get-favorites'
import getPagedRecs from '../actions/recs/get-paged-recs'
import markRecsAsRead from '../actions/recs/mark-as-read'
import getValertsWidget from '../actions/listings/get-valerts-widget'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => {
  const action = payload.action
  switch (action) {

    case 'search-listing-transaction':
      searchListingTransaction(payload.user, payload.q)
      break

    case 'search-listing-map':
      searchListingMap(payload.user, payload.q, payload.status)
      break

    case 'search-listing-input':
      searchListingInput(payload.user, payload.q)
      break

    case 'search-listing-widget':
      searchListingWidget(payload.user, payload.q)
      break

    case 'get-similar-listings':
      getSimilarListings(payload.user, payload.mls_number)
      break

    case 'get-valerts':
      getValerts(payload.user, payload.options)
      break

    case 'get-valerts-alert':
      getValertsAlert(payload.user, payload.options)
      break

    case 'get-valerts-widget':
      getValertsWidget(payload.user, payload.options)
      break

    case 'get-listing':
      getListing(payload.user, payload.id)
      break

    case 'share-alert':
      shareAlert(payload.user, payload.rooms, payload.contacts, payload.emails, payload.phone_numbers, payload.alert)
      break

    case 'get-alert-room':
      getAlertRoom(payload.user, payload.room_id, payload.alert_id)
      break

    case 'get-alert-map':
      getAlertMap(payload.user, payload.room_id, payload.alert_id)
      break

    case 'get-paged-recs':
      getPagedRecs(payload.user, payload.alert, payload.timestamp)
      break

    case 'get-alerts':
      getAlerts(payload.user)
      break

    case 'get-actives':
      getActives(payload.user)
      break

    case 'get-favorites':
      getFavorites(payload.user)
      break

    case 'share-listing':
      shareListing(payload.user, payload.mls_number, payload.message, payload.rooms, payload.users, payload.emails, payload.phone_numbers, payload.notification)
      break

    case 'edit-favorite':
      editFavorite(payload.user, payload.mls_number, payload.favorite)
      break

    case 'mark-recs-as-read':
      markRecsAsRead(payload.user, payload.recommendations)
      break

    default:
      return true
  }
  return true
})

export default ListingDispatcher