// controller/listing-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  shareListing() {
    const data = AppStore.data
    const user = data.user
    const current_listing = AppStore.data.current_listing
    const share_modal = AppStore.data.share_modal
    let rooms_added
    let contacts_added
    let emails_added
    let phone_numbers_added
    if (share_modal) {
      if (share_modal.rooms_added && share_modal.rooms_added.length)
        rooms_added = _.map(share_modal.rooms_added, 'id')
      if (share_modal.contacts_added && share_modal.contacts_added.length)
        contacts_added = _.map(_.map(share_modal.contacts_added, 'contact_user'), 'id')
      if (share_modal.emails_added && share_modal.emails_added.length)
        emails_added = share_modal.emails_added
      if (share_modal.phone_numbers_added && share_modal.phone_numbers_added.length)
        phone_numbers_added = share_modal.phone_numbers_added
    }
    if (!rooms_added && !contacts_added && !emails_added && !phone_numbers_added)
      return
    const message = this.refs.message.value.trim()
    AppStore.data.share_modal.sending_share = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'share-listing',
      user,
      mls_number: current_listing.mls_number,
      message,
      rooms: rooms_added,
      users: contacts_added,
      emails: emails_added,
      phone_numbers: phone_numbers_added,
      notification: true
    })
  }
}
export default controller