// actions/listings/share-alert.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'

export default (user, rooms, users, emails, phone_numbers, alert) => {
  AppStore.data.listing_map.saving_alert = true
  AppStore.emitChange()
  const params = {
    access_token: user.access_token,
    alert,
    users,
    emails,
    phone_numbers
  }
  Alert.create(params, (err, res) => {
    delete AppStore.data.listing_map.saving_alert
    delete AppStore.data.listing_map.show_share_modal
    delete AppStore.data.share_list
    AppStore.data.show_alert_saved_modal = true
    if (res.status === 'success') {
      const new_alert = res.data[0]
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