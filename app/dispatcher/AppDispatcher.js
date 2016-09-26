// AppDispatcher.js
import { Dispatcher } from 'flux'

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
import getRooms from '../actions/user/get-rooms'
import getRoomsIndexedDB from '../actions/indexeddb/get-rooms'
import getContacts from '../actions/user/get-contacts'
import createContacts from '../actions/user/create-contacts'
import editContact from '../actions/user/edit-contact'
import deleteContact from '../actions/user/delete-contact'
import editProfilePic from '../actions/user/edit-profile-pic'
import editPassword from '../actions/user/edit-password'
import upgradeAccount from '../actions/user/upgrade-account'
import listingInquiry from '../actions/user/listing-inquiry'
import searchUsersNewMessage from '../actions/user/search-new-message'
import searchUsersShare from '../actions/user/search-share'
// Rooms
import createRoom from '../actions/rooms/create-room'
import deleteRoom from '../actions/rooms/delete-room'
import inviteContacts from '../actions/rooms/invite-contacts'
import addUsers from '../actions/rooms/add-users'
import uploadFilesToRoom from '../actions/rooms/upload-files'
import setNotification from '../actions/rooms/notifications'
import acknowledgeRoomNotifications from '../actions/rooms/acknowledge-notifications'
import getRoomAndMessages from '../actions/rooms/get-room-and-messages'
import leaveRoom from '../actions/rooms/leave-room'

// Messages
import createMessage from '../actions/messages/create-message'
import updateRoomsIndexedDB from '../actions/indexeddb/update-rooms'
import getMessages from '../actions/messages/get-messages'
import getAllMessages from '../actions/messages/get-all-messages'
import getPreviousMessages from '../actions/messages/get-previous-messages'

// Pages
import landingPage from '../actions/pages/landing'
import getContent from '../actions/pages/get-content'

// Modules
import addContacts from '../actions/modules/add-contacts'
import removeContact from '../actions/modules/remove-contact'

// Notifications
import getNotificationSummery from '../actions/notifications/get-summary'

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

// Chat module
import sendChatModuleMessage from '../actions/chat-module/send-message'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {
  const action = payload.action
  switch (action) {

    case 'get-content':
      getContent(payload.slug, payload.rendered, payload.res, payload.callback)
      break

    case 'landing-text-animation':
      landingPage.animateText()
      break

    case 'landing-swap-video':
      landingPage.swapVideo(payload.video_src)
      break

    case 'sign-up':
      signup(payload.user, payload.password, payload.confirm_password, payload.redirect_to)
      break

    case 'sign-up-shadow':
      signupShadow(payload.user, payload.redirect_to)
      break

    case 'sign-in':
      signin(payload.email, payload.password, payload.redirect_to, payload.invite)
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
      createPassword(payload.email, payload.password, payload.first_name, payload.last_name, payload.token)
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

    case 'create-room':
      createRoom(payload.user, payload.users, payload.emails, payload.phone_numbers, payload.comment)
      break

    case 'get-rooms':
      getRooms(payload.user, payload.room_id)
      break

    case 'get-room-and-messages':
      getRoomAndMessages(payload.user, payload.room)
      break

    case 'get-rooms-indexeddb':
      getRoomsIndexedDB(payload.user_id)
      break

    case 'delete-room':
      deleteRoom(payload.user, payload.id)
      break

    case 'leave-room':
      leaveRoom(payload.user, payload.id)
      break

    case 'get-contacts':
      getContacts(payload.user)
      break

    case 'invite-contacts':
      inviteContacts(payload.user, payload.room, payload.contacts)
      break

    case 'add-users':
      addUsers(payload.user, payload.room, payload.users, payload.emails, payload.phone_numbers)
      break

    case 'create-message':
      createMessage(payload.user, payload.room, payload.comment, payload.image_url, payload.attachment)
      break

    case 'update-rooms-indexeddb':
      updateRoomsIndexedDB(payload.user_id)
      break

    case 'get-messages':
      getMessages(payload.user, payload.room)
      break

    case 'get-all-messages':
      getAllMessages(payload.user, payload.rooms)
      break

    case 'get-previous-messages':
      getPreviousMessages(payload.user, payload.room, payload.scroll_height)
      break

    case 'create-contacts':
      createContacts(payload.user, payload.contacts, payload.module_type)
      break

    case 'edit-contact':
      editContact(payload.user, payload.contact, payload.module_type)
      break

    case 'delete-contact':
      deleteContact(payload.user, payload.contact_id)
      break

    case 'add-contacts':
      addContacts(payload.contacts, payload.module_type)
      break

    case 'remove-contact':
      removeContact(payload.contact_id, payload.module_type)
      break

    case 'room-notifications':
      setNotification(payload.user, payload.id, payload.notification)
      break

    case 'upload-files-to-room':
      uploadFilesToRoom(payload.user, payload.room, payload.files)
      break

    case 'get-notification-summary':
      getNotificationSummery(payload.user)
      break

    case 'edit-profile-pic':
      editProfilePic(payload.user, payload.files)
      break

    case 'edit-password':
      editPassword(payload.user, payload.old_password, payload.new_password)
      break

    case 'acknowledge-alert-notifications':
      acknowledgeAlertNotifications(payload.user, payload.alert_id)
      break

    case 'acknowledge-room-notifications':
      acknowledgeRoomNotifications(payload.user, payload.room)
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

    case 'send-chat-module-message':
      sendChatModuleMessage(payload.user, payload.agent, payload.message)
      break

    case 'search-users-new-message':
      searchUsersNewMessage(payload.user, payload.q)
      break

    case 'search-users-share':
      searchUsersShare(payload.user, payload.q)
      break

    default:
      return true
  }
  return true
})

export default AppDispatcher