// actions/listings/share-alert.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'

export default (user, room_id, alert_id) => {
  const params = {
    access_token: user.access_token,
    room_id,
    alert_id
  }
  Alert.get(params, (err, res) => {
    const alert = res.data
    AppStore.data.current_alert = alert
    AppStore.data.listing_alerts = alert
    AppStore.emitChange()
  })
}