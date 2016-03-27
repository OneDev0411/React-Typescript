// controller/listing-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  shareAlert(title) {
    delete AppStore.data.error
    AppStore.emitChange()
    const data = AppStore.data
    const listing_map = data.listing_map
    const alert = listing_map.options
    const user = data.user
    const share_modal = data.share_modal
    let rooms_added = []
    let contacts_added = []
    let emails_added = []
    let phone_numbers_added = []
    if (share_modal) {
      if (share_modal.rooms_added)
        rooms_added = share_modal.rooms_added
      if (share_modal.contacts_added)
        contacts_added = share_modal.contacts_added
      if (share_modal.emails_added)
        emails_added = share_modal.emails_added
      if (share_modal.phone_numbers_added)
        phone_numbers_added = share_modal.phone_numbers_added
    }
    if (!title) {
      AppStore.data.error = {
        message: 'You must name this alert.'
      }
      AppStore.emitChange()
      return
    }
    if (!rooms_added.length && !contacts_added.length && !emails_added.length && !phone_numbers_added.length) {
      AppStore.data.error = {
        message: 'You must add at least one room or one contact.'
      }
      AppStore.emitChange()
      return
    }
    alert.title = title
    ListingDispatcher.dispatch({
      action: 'share-alert',
      user,
      rooms: rooms_added,
      contacts: contacts_added,
      emails: emails_added,
      phone_numbers: phone_numbers_added,
      alert
    })
  }
}
export default controller