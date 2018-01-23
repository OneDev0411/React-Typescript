// AppDispatcher.js
import { Dispatcher } from './flux'

// Device
import checkForMobile from '../actions/device/check-for-mobile'

// Alerts
import acknowledgeAlertNotifications from '../actions/alerts/acknowledge-notifications'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(async payload => {
  const action = payload.action

  switch (action) {
    case 'acknowledge-alert-notifications':
      acknowledgeAlertNotifications(payload.user, payload.alert_id)
      break
    case 'check-for-mobile':
      checkForMobile()
      break
    default:
      return true
  }

  return true
})

export default AppDispatcher
