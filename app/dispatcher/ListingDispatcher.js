// ListingDispatcher.js
import { Dispatcher } from './flux'

// Listings
import editFavorite from '../actions/rooms/edit-favorite'
import getActives from '../actions/recs/get-actives'
import getFavorites from '../actions/recs/get-favorites'
import markRecsAsRead from '../actions/recs/mark-as-read'

const ListingDispatcher = new Dispatcher()

// Register callback with AppDispatcher
ListingDispatcher.register(payload => {
  const action = payload.action

  switch (action) {
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
