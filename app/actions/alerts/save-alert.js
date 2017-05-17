// actions/listings/share-alert.js
import AppStore from '../../stores/AppStore'
import Room from '../../models/Room'
export default (user, alert) => {
  // TODO remove hack fix
  if (alert.mls_areas === 'null')
    alert.mls_areas = null
  AppStore.data.listing_map.saving_alert = true
  AppStore.emitChange()
  const params = {
    access_token: user.access_token,
    alert,
    room_id: user.personal_room
  }
  Room.createAlert(params, (err, res) => {
    delete AppStore.data.listing_map.show_share_type_modal
    delete AppStore.data.listing_map.saving_alert
    delete AppStore.data.listing_map.show_share_modal
    delete AppStore.data.share_list
    AppStore.data.show_alert_saved_modal = true
    if (res.status === 'success') {
      const new_alert = res.data
      if (!AppStore.data.alerts)
        AppStore.data.alerts = []
      AppStore.data.alerts.unshift(new_alert)
    }
    AppStore.emitChange()
    setTimeout(() => {
      delete AppStore.data.show_alert_saved_modal
      AppStore.emitChange()
    }, 3000)
  })
}