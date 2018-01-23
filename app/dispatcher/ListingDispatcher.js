// ListingDispatcher.js
import { Dispatcher } from './flux'

// Listings
import searchMlsNumber from '../actions/listings/search-mls-number'
import searchListingWidget from '../actions/listings/search-widget'
import searchListingInput from '../actions/listings/search-input'
import getValerts from '../actions/listings/get-valerts'
import getValertsAlert from '../actions/listings/get-valerts-alert'
import getValertsNoGeo from '../actions/listings/get-valerts-no-geo'
import getListing from '../actions/listings/get-listing'
import editFavorite from '../actions/rooms/edit-favorite'
import getActives from '../actions/recs/get-actives'
import getFavorites from '../actions/recs/get-favorites'
import markRecsAsRead from '../actions/recs/mark-as-read'
import getValertsWidget from '../actions/listings/get-valerts-widget'
import pageValertsWidget from '../actions/listings/page-valerts-widget'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => {
  const action = payload.action

  switch (action) {
    case 'search-mls-number':
      searchMlsNumber(payload.user, payload.q, payload.status)
      break

    case 'search-listing-input':
      searchListingInput(payload.user, payload.q)
      break

    case 'search-listing-widget':
      searchListingWidget(payload.user, payload.q)
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

    case 'get-valerts-no-geo':
      getValertsNoGeo(payload.user, payload.options)
      break

    case 'page-listings-widget':
      pageValertsWidget(payload.user, payload.options)
      break

    case 'get-listing':
      getListing(payload.user, payload.id)
      break

    case 'get-actives':
      getActives(payload.user)
      break

    case 'get-favorites':
      getFavorites(payload.user)
      break

    case 'edit-favorite':
      editFavorite(payload.user, payload.mls_number, payload.favorite)
      break

    case 'mark-recs-as-read':
      markRecsAsRead(payload.user, payload.alert_id, payload.room_id)
      break

    default:
      return true
  }

  return true
})

export default ListingDispatcher
