// controller/alert-share.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
const controller = {
  handleUserNotLoggedIn() {
    AppStore.data.show_signup_form = true
    const data = AppStore.data
    const listing_map = data.listing_map
    const alert = listing_map.options
    AppStore.data.signup_tooltip = {
      action: 'create_alert',
      alert
    }
    AppStore.emitChange()
  },
  showShareTypeModal() {
    delete AppStore.data.share_modal
    delete AppStore.data.error
    const total = AppStore.data.listing_map.listings_info.total
    // If too many listings
    if (total > 200) {
      AppStore.data.listing_map.show_share_alert_error_tooltip = true
      AppStore.emitChange()
      return
    }
    // If user not logged in
    if (!AppStore.data.user) {
      controller.handleUserNotLoggedIn()
      return
    }
    AppStore.data.listing_map.show_share_type_modal = true
    AppStore.emitChange()
  },
  handleAlertShareClick() {
    controller.showShareTypeModal()
  },
  showShareModal(title) {
    delete AppStore.data.listing_map.show_share_type_modal
    AppStore.data.listing_map.show_share_modal = true
    if (!AppStore.data.share_modal)
      AppStore.data.share_modal = {}
    AppStore.data.share_modal.title = title
    AppStore.emitChange()
  },
  shareAlert() {
    const data = AppStore.data
    const listing_map = data.listing_map
    const alert = listing_map.options
    if (data.share_modal.title)
      alert.title = data.share_modal.title
    const user = data.user
    const share_modal = AppStore.data.share_modal
    const users = _.map(share_modal.items_selected, 'value.contact_user.id')
    const message = this.refs.message.refs.input.value.trim()
    AppStore.data.share_modal.sending_share = true
    AppStore.emitChange()
    let emails
    let phone_numbers
    // console.log(alert)
    ListingDispatcher.dispatch({
      action: 'share-alert',
      user,
      users,
      emails,
      phone_numbers,
      alert,
      message
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
    // const center = data.listing_map.center
    // alert.location = {
    //   latitude: center.lat,
    //   longitude: center.lng
    // }
    // console.log(alert.points)
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