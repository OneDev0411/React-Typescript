// actions/listings/get-alerts.js
import Alert from '../../models/Alert'
import AppStore from '../../stores/AppStore'

export default (user) => {
  const params = {
    access_token: user.access_token
  }
  Alert.getAll(params, (err, res) => {
    const alerts = res.data
    AppStore.data.alerts = alerts
    AppStore.emitChange()
  })
}