// AppDispatcher.js
import { Dispatcher } from 'flux'
import invariant from 'invariant'
import _ from 'underscore'

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
import searchUsersAddMembers from '../actions/user/search-add-members'
import getReceivingUser from '../actions/user/get-receiving-user'
// Rooms
import createRoom from '../actions/rooms/create-room'
import deleteRoom from '../actions/rooms/delete-room'
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

// Deals
import getDeals from '../actions/deals/get-deals'
import createDeal from '../actions/deals/create-deal'
import getSubmissions from '../actions/deals/get-submissions'
import addSubmission from '../actions/deals/add-submission'
import getSubmissionForm from '../actions/deals/get-submission-form'
import getEnvelopes from '../actions/deals/get-envelopes'
import getDealForms from '../actions/deals/get-deal-forms'
import uploadFile from '../actions/deals/upload-file'
import saveSubmissionForm from '../actions/deals/save-submission-form'

/**
 * Dispatches a payload to all registered callbacks.
 */
Dispatcher.prototype.dispatchSync = async function dispatch(payload) {
  !!this._isDispatching ?  true ? invariant(false, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.') : invariant(false) : undefined;
  this._startDispatching(payload)

  const response = {}

  try {
    for (let id in this._callbacks) {
      if (this._isPending[id]) {
        continue
      }

      this._isPending[id] = true
      response[id] = await this._callbacks[id](this._pendingPayload)
      this._isHandled[id] = true
    }
  } finally {
    this._stopDispatching()
  }

  return _.size(response) === 1 ? response[Object.keys(response)[0]] : response
}

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(async function (payload) {
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
      createPassword(payload.email, payload.password, payload.first_name, payload.last_name, payload.token, payload.agent, payload.new_email, payload.phone_number)
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

    case 'add-users':
      addUsers(payload.user, payload.room, payload.users, payload.emails, payload.phone_numbers)
      break

    case 'create-message':
      createMessage(payload.user, payload.room, payload.comment, payload.image_url, payload.attachment, payload.recommendation)
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

    case 'search-users-add-members':
      searchUsersAddMembers(payload.user, payload.q)
      break

    case 'get-receiving-user':
      getReceivingUser(payload.user_id)
      break

    case 'get-deals':
      getDeals(payload.user)
      break

    case 'create-deal':
      return await createDeal(payload.data, payload.user)
      break

    case 'get-submissions':
      getSubmissions(payload.id, payload.user)
      break

    case 'add-submission':
      addSubmission(payload.id, payload.form)
      break

    case 'get-deal-forms':
      getDealForms(payload.user)
      break

    case 'get-envelopes':
      getEnvelopes(payload.id, payload.user)
      break

    case 'upload-file':
      uploadFile(payload.id, payload.user, payload.file)
      break

    case 'save-submission-form':
      saveSubmissionForm(payload.user, payload.type, payload.deal,
        payload.form, payload.state, payload.values, payload.submission)
      break

    case 'get-submission-form':
      getSubmissionForm(payload.user, payload.deal, payload.last_revision)
      break

    default:
      return true
  }
  return true
})

export default AppDispatcher
