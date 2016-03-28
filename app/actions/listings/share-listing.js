// actions/listings/share-listing.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (user, mls_number, rooms_added, contacts_added, emails_added, notification) => {
  async.eachSeries(rooms_added, (room, callback) => {
    const params = {
      access_token: user.access_token,
      room_id: room.id,
      mls_number,
      notification
    }
    Room.createRec(params, () => {
      // Success
      callback()
    })
  }, () => {
    delete AppStore.data.share_modal.sending_share
    delete AppStore.data.show_share_listing_modal
    AppStore.emitChange()
  })
}