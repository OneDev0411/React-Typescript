// controller/alert-viewer.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showAlertViewer(alert_id) {
    const data = AppStore.data
    const current_room = data.current_room
    const user = data.user
    AppStore.data.show_alert_viewer = true
    AppStore.emitChange()
    ListingDispatcher.dispatch({
      action: 'get-alert',
      user,
      room_id: current_room.id,
      alert_id
    })
  },
  hideAlertViewer() {
    delete AppStore.data.show_alert_viewer
    delete AppStore.data.listing_alerts
    AppStore.emitChange()
  }
}
export default controller