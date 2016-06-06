// controller/alert-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showShareTypeModal() {
    delete AppStore.data.share_modal
    delete AppStore.data.error
    const total = AppStore.data.listing_map.listings_info.total
    AppStore.data.listing_map.show_share_type_modal = true
    if (total >= 150) {
      AppStore.data.share_modal = {
        error: true
      }
    }
    AppStore.emitChange()
  },
  showShareModal(title) {
    delete AppStore.data.listing_map.show_share_type_modal
    AppStore.data.listing_map.show_share_modal = true
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.title = title
    AppStore.emitChange()
  },
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
  saveForMe(title) {
    const data = AppStore.data
    const listing_map = data.listing_map
    const user = data.user
    const rooms = [{
      title: 'Personal',
      id: user.personal_room
    }]
    let contacts_added
    let emails_added
    let phone_numbers_added
    const alert = listing_map.options
    alert.title = ''
    if (title)
      alert.title = title
    const center = data.listing_map.center
    alert.location = {
      latitude: center.lat,
      longitude: center.lng
    }
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.saving = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'share-alert',
      user,
      rooms,
      contacts: contacts_added,
      emails: emails_added,
      phone_numbers: phone_numbers_added,
      alert
    })
  },
  handleAlertTitleChange(title) {
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.title = title
    AppStore.emitChange()
  }
}
export default controller