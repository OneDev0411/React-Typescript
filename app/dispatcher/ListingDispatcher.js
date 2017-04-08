// ListingDispatcher.js
import { Dispatcher } from './flux'

// Listings
import searchListingTransaction from '../actions/listings/search-transaction'
import searchListingMap from '../actions/listings/search-map'
import searchListingWidget from '../actions/listings/search-widget'
import searchListingInput from '../actions/listings/search-input'
import getSimilarListings from '../actions/listings/get-similars'
import getValerts from '../actions/listings/get-valerts'
import getValertsAlert from '../actions/listings/get-valerts-alert'
import getValertsNoGeo from '../actions/listings/get-valerts-no-geo'
import getListing from '../actions/listings/get-listing'
import shareAlert from '../actions/alerts/share-alert'
import saveAlert from '../actions/alerts/save-alert'
import getAlertRoom from '../actions/alerts/get-alert-room'
import getAlertMap from '../actions/alerts/get-alert-map'
import getAlerts from '../actions/alerts/get-alerts'
import shareListing from '../actions/listings/share-listing'
import editFavorite from '../actions/rooms/edit-favorite'
import getActives from '../actions/recs/get-actives'
import getFavorites from '../actions/recs/get-favorites'
import getPagedRecs from '../actions/recs/get-paged-recs'
import markRecsAsRead from '../actions/recs/mark-as-read'
import getValertsWidget from '../actions/listings/get-valerts-widget'
import pageValertsWidget from '../actions/listings/page-valerts-widget'
import searchSchoolDistrictsMap from '../actions/schools/search-school-districts-map'
import searchSchoolsMap from '../actions/schools/search-schools-map'
import searchAreasMap from '../actions/areas/search-areas-map'
import showCountiesMap from '../actions/counties/show-counties-map'
import searchSubdivisionsMap from '../actions/subdivisions/search-subdivisions-map'
const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register((payload) => {
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

    case 'get-valerts-no-geo':
      getValertsNoGeo(payload.user, payload.options)
      break

    case 'page-listings-widget':
      pageValertsWidget(payload.user, payload.options)
      break

    case 'get-listing':
      getListing(payload.user, payload.id)
      break

    case 'save-alert':
      saveAlert(payload.user, payload.alert)
      break

    case 'share-alert':
      shareAlert(payload.user, payload.rooms, payload.users, payload.emails, payload.phone_numbers, payload.alert, payload.message)
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
      shareListing(payload.user, payload.mls_number, payload.message, payload.users, payload.emails, payload.phone_numbers, payload.notification)
      break

    case 'edit-favorite':
      editFavorite(payload.user, payload.mls_number, payload.favorite)
      break

    case 'mark-recs-as-read':
      markRecsAsRead(payload.user, payload.alert_id, payload.room_id)
      break

    case 'search-schools-map':
      searchSchoolsMap(payload.districts)
      break

    case 'search-school-districts-map':
      searchSchoolDistrictsMap(payload.q)
      break

    case 'search-areas-map':
      searchAreasMap(payload.parents, payload.q)
      break

    case 'show-counties-map':
      showCountiesMap(payload.q)
      break

    case 'search-subdivisions-map':
      searchSubdivisionsMap(payload.q)
      break

    default:
      return true
  }
  return true
})

export default ListingDispatcher
