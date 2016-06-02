// controller/alert-modal.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showAlertModal(alert_id, room_id) {
    delete AppStore.data.error
    AppStore.emitChange()
    const data = AppStore.data
    const user = data.user
    AppStore.data.show_alert_modal = true
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/recents/' + room_id + '?alert=' + alert_id)
    ListingDispatcher.dispatch({
      action: 'get-alert-room',
      user,
      room_id,
      alert_id
    })
  },
  hideAlertModal() {
    delete AppStore.data.show_alert_modal
    delete AppStore.data.alert_modal
    delete AppStore.data.listing_alerts
    const data = AppStore.data
    const current_room = data.current_room
    const history = require('../../../../utils/history')
    history.replaceState(null, '/dashboard/recents/' + current_room.id)
    delete AppStore.data.current_alert
    AppStore.emitChange()
  },
  setAlertGalleryActiveIndex(active_index) {
    if (!AppStore.data.alert_modal)
      AppStore.data.alert_modal = {}
    AppStore.data.alert_modal.active_index = active_index
    AppStore.emitChange()
  }
}
export default controller