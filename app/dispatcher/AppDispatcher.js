// AppDispatcher.js
import { Dispatcher } from './flux'

// User
import signup from '../actions/user/signup'
import signupShadow from '../actions/user/signup-shadow'
import signin from '../actions/user/signin'
import editUser from '../actions/user/edit-user'
import forgotPassword from '../actions/user/forgot-password'
import forgotPasswordResend from '../actions/user/forgot-password-resend'
import resetPassword from '../actions/user/reset-password'
import createPassword from '../actions/user/create-password'
import verifyPhone from '../actions/user/verify-phone'
import sendVerifyEmail from '../actions/user/send-verify-email'
import addUserToStore from '../actions/user/add-user-to-store'
import editProfilePic from '../actions/user/edit-profile-pic'
import editPassword from '../actions/user/edit-password'
import upgradeAccount from '../actions/user/upgrade-account'
import listingInquiry from '../actions/user/listing-inquiry'
import searchUsersNewMessage from '../actions/user/search-new-message'
import searchUsersShare from '../actions/user/search-share'
import searchUsersAddMembers from '../actions/user/search-add-members'
// Rooms
import setNotification from '../actions/rooms/notifications'

// Pages
import getContent from '../actions/pages/get-content'

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
AppDispatcher.register(async (payload) => {
  const action = payload.action

  switch (action) {
    case 'get-content':
      getContent(payload.slug, payload.rendered, payload.res, payload.callback)
      break

    case 'sign-up':
      signup(
        payload.user,
        payload.password,
        payload.confirm_password,
        payload.redirect_to
      )
      break

    case 'sign-up-shadow':
      signupShadow(payload.user, payload.redirect_to)
      break

    case 'sign-in':
      signin(
        payload.email,
        payload.password,
        payload.redirect_to,
        payload.invite
      )
      break

    case 'edit-user':
      editUser(payload.user, payload.user_info)
      break

    case 'forgot-password':
      forgotPassword(payload.email)
      break

    case 'forgot-password-resend':
      forgotPasswordResend(payload.email)
      break

    case 'reset-password':
      resetPassword(payload.password, payload.confirm_password, payload.token)
      break

    case 'create-password':
      createPassword(
        payload.email,
        payload.password,
        payload.first_name,
        payload.last_name,
        payload.token,
        payload.agent,
        payload.new_email,
        payload.phone_number
      )
      break

    case 'send-verify-email':
      sendVerifyEmail(payload.access_token)
      break

    case 'verify-phone':
      verifyPhone(payload.code, payload.token)
      break

    case 'add-user-to-store':
      addUserToStore(payload.user)
      break

    case 'room-notifications':
      setNotification(payload.user, payload.id, payload.notification)
      break

    case 'edit-profile-pic':
      editProfilePic(payload.files)
      break

    case 'edit-password':
      editPassword(payload.user, payload.old_password, payload.new_password)
      break

    case 'acknowledge-alert-notifications':
      acknowledgeAlertNotifications(payload.user, payload.alert_id)
      break

    case 'get-agent-report':
      getAgentReport(payload.user, payload.criteria)
      break

    case 'search-agent-signup':
      searchAgentSignup(payload.mlsid)
      break

    case 'search-agent-settings':
      searchAgentSettings(payload.mlsid)
      break

    case 'check-for-mobile':
      checkForMobile()
      break

    case 'upgrade-account':
      upgradeAccount(payload.user, payload.agent, payload.secret)
      break

    case 'get-branding':
      getBranding(payload.hostname)
      break

    case 'listing-inquiry':
      listingInquiry(payload.user, payload.agent, payload.listing)
      break

    case 'geocode-address':
      geocodeAddress(payload.address)
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
