// actions/listings/share-listing.js
import Room from '../../models/Room'
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import async from 'async'
import getAllMessages from '../messages/get-all-messages'
export default (user, mls_number, message, rooms, users, emails, phone_numbers, notification) => {
  const params = {
    access_token: user.access_token,
    message,
    rooms,
    users,
    mls_number,
    emails,
    phone_numbers,
    notification
  }
  async.series([
    callback => {
      Room.createRec(params, (err, res) => {
        // Success
        delete AppStore.data.share_modal.sending_share
        delete AppStore.data.show_share_listing_modal
        AppStore.emitChange()
        callback()
      })
    },
    () => {
      User.getRooms(params, (err, res) => {
        const updated_rooms = res.data
        AppStore.data.rooms = updated_rooms
        getAllMessages(user, updated_rooms)
        AppStore.emitChange()
      })
    }
  ])
}