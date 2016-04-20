// actions/listings/share-listing.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
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
  Room.createRec(params, () => {
    // Success
    delete AppStore.data.share_modal.sending_share
    delete AppStore.data.show_share_listing_modal
    AppStore.emitChange()
  })
}