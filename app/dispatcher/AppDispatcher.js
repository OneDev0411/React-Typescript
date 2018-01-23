// AppDispatcher.js
import { Dispatcher } from './flux'

// Rooms
import setNotification from '../actions/rooms/notifications'

// Agents
import getAgentReport from '../actions/agents/get-report'
import searchAgentSignup from '../actions/agents/search-agent-signup'
import searchAgentSettings from '../actions/agents/search-agent-settings'

// Device
import checkForMobile from '../actions/device/check-for-mobile'

// Alerts
import acknowledgeAlertNotifications from '../actions/alerts/acknowledge-notifications'

// Branding
import getBranding from '../actions/branding/get-branding'

// Google geocodeAddress
import geocodeAddress from '../actions/google/geocode-address'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(async payload => {
  const action = payload.action

  switch (action) {
    case 'add-user-to-store':
      addUserToStore(payload.user)
      break

    case 'room-notifications':
      setNotification(payload.user, payload.id, payload.notification)
      break

    case 'acknowledge-alert-notifications':
      acknowledgeAlertNotifications(payload.user, payload.alert_id)
      break

    case 'check-for-mobile':
      checkForMobile()
      break

    case 'search-users-new-message':
      searchUsersNewMessage(payload.user, payload.q)
      break

    case 'search-users-share':
      searchUsersShare(payload.user, payload.q)
      break

    case 'search-users-add-members':
      searchUsersAddMembers(payload.user, payload.q)
      break

    default:
      return true
  }

  return true
})

export default AppDispatcher
