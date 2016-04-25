// controller/listing-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  shareAlert(title) {
    delete AppStore.data.error
    AppStore.emitChange()
    const data = AppStore.data
    const listing_map = data.listing_map
    const alert = listing_map.options
    const user = data.user
    const share_modal = data.share_modal
    let rooms_added
    let contacts_added
    let emails_added
    let phone_numbers_added
    if (share_modal) {
      if (share_modal.rooms_added && share_modal.rooms_added.length)
        rooms_added = share_modal.rooms_added
      if (share_modal.contacts_added && share_modal.contacts_added.length)
        contacts_added = share_modal.contacts_added
      if (share_modal.emails_added && share_modal.emails_added.length)
        emails_added = share_modal.emails_added
      if (share_modal.phone_numbers_added && share_modal.phone_numbers_added.length)
        phone_numbers_added = share_modal.phone_numbers_added
    }
    if (!rooms_added && !contacts_added && !emails_added && !phone_numbers_added)
      return
    if (!title) {
      AppStore.data.error = {
        message: 'You must name this alert.'
      }
      AppStore.emitChange()
      return
    }
    if (!rooms_added && !contacts_added && !emails_added && !phone_numbers_added) {
      AppStore.data.error = {
        message: 'You must add at least one room, contact, email or phone number.'
      }
      AppStore.emitChange()
      return
    }
    alert.title = title
    const center = data.listing_map.center
    alert.location = {
      latitude: center.lat,
      longitude: center.lng
    }
    ListingDispatcher.dispatch({
      action: 'share-alert',
      user,
      rooms: rooms_added,
      contacts: contacts_added,
      emails: emails_added,
      phone_numbers: phone_numbers_added,
      alert
    })
  },
  shareListing() {
    const data = AppStore.data
    const user = data.user
    const current_listing = AppStore.data.current_listing
    const share_modal = AppStore.data.share_modal
    const rooms = _.pluck(share_modal.rooms_added, 'id')
    const users = _.pluck(share_modal.contacts_added, 'id')
    const emails = share_modal.emails_added
    const phone_numbers = share_modal.phone_numbers_added
    if (!rooms || !rooms.length && !users || !users.length && !emails || !emails.length && !phone_numbers || !phone_numbers.length)
      return
    const message = this.refs.message.value.trim()
    AppStore.data.share_modal.sending_share = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'share-listing',
      user,
      mls_number: current_listing.mls_number,
      message,
      rooms,
      users,
      emails,
      phone_numbers,
      notification: true
    })
  }
}
export default controller