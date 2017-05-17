// controller/alert-modal.js
import ListingDispatcher from '../../../../dispatcher/ListingDispatcher'
import AppStore from '../../../../stores/AppStore'
import { browserHistory } from 'react-router'
const controller = {
  showAlertModal(alert_id, room_id) {
    const data = AppStore.data
    browserHistory.push(`/dashboard/mls/alerts/${alert_id}`)
  },
  // hideAlertModal() {
  //   delete AppStore.data.show_alert_modal
  //   delete AppStore.data.alert_modal
  //   delete AppStore.data.listing_alerts
  //   const data = AppStore.data
  //   const current_room = data.current_room
  //   browserHistory.push(`/dashboard/recents/${current_room.id}`)
  //   delete AppStore.data.current_alert
  //   AppStore.emitChange()
  // },
  setAlertGalleryActiveIndex(active_index) {
    if (!AppStore.data.alert_modal)
      AppStore.data.alert_modal = {}
    AppStore.data.alert_modal.active_index = active_index
    AppStore.emitChange()
  }
}
export default controller