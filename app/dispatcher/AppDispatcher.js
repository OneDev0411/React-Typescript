// AppDispatcher.js
import { Dispatcher } from 'flux'

// User
import signup from '../actions/user/signup'
import signin from '../actions/user/signin'
import forgotPassword from '../actions/user/forgot-password'
import resetPassword from '../actions/user/reset-password'
import verifyPhone from '../actions/user/verify-phone'
import addUserToStore from '../actions/user/add-user-to-store'
import getRooms from '../actions/user/get-rooms'
import getContacts from '../actions/user/get-contacts'
import createContacts from '../actions/user/create-contacts'
import editContact from '../actions/user/edit-contact'
import deleteContact from '../actions/user/delete-contact'
// Rooms
import createRoom from '../actions/rooms/create-room'
import inviteContacts from '../actions/rooms/invite-contacts'
import uploadFilesToRoom from '../actions/rooms/upload-files'
import setNotification from '../actions/rooms/notifications'

// Messages
import createMessage from '../actions/messages/create-message'
import getMessages from '../actions/messages/get-messages'
import getAllMessages from '../actions/messages/get-all-messages'
import getPreviousMessages from '../actions/messages/get-previous-messages'

// Pages
import landingPage from '../actions/pages/landing'
import getContent from '../actions/pages/get-content'

// Modules
import addContact from '../actions/modules/add-contact'
import removeContact from '../actions/modules/remove-contact'

// Listings
import searchListing from '../actions/listings/search'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {
  const action = payload.action

  // User
  let email
  let password
  let confirm_password
  let redirect_to
  let token
  let code
  let contacts

  // Room
  let user
  let invite
  let room_id
  let rooms
  let room
  let comment
  let title
  let scroll_height
  let image_url
  let attachment
  let id
  let notification

  // Add Contact Module
  let contact
  let contact_id
  let module_type

  // Listing
  let q

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
      user = payload.user
      password = payload.password
      confirm_password = payload.confirm_password
      redirect_to = payload.redirect_to
      signup(user, password, confirm_password, redirect_to)
      break

    case 'sign-in':
      email = payload.email
      password = payload.password
      redirect_to = payload.redirect_to
      invite = payload.invite
      signin(email, password, redirect_to, invite)
      break

    case 'forgot-password':
      email = payload.email
      forgotPassword(email)
      break

    case 'reset-password':
      password = payload.password
      confirm_password = payload.confirm_password
      token = payload.token
      resetPassword(password, confirm_password, token)
      break

    case 'verify-phone':
      code = payload.code
      token = payload.token
      verifyPhone(code, token)
      break

    case 'add-user-to-store':
      user = payload.user
      addUserToStore(user)
      break

    case 'create-room':
      title = payload.title
      user = payload.user
      createRoom(user, title)
      break

    case 'get-rooms':
      user = payload.user
      room_id = payload.room_id
      getRooms(user, room_id)
      break

    case 'get-contacts':
      user = payload.user
      getContacts(user)
      break

    case 'invite-contacts':
      inviteContacts(payload.user, payload.room, payload.contacts)
      break

    case 'create-message':
      user = payload.user
      room = payload.room
      comment = payload.comment
      image_url = payload.image_url
      attachment = payload.attachment
      createMessage(user, room, comment, image_url, attachment)
      break

    case 'get-messages':
      user = payload.user
      room = payload.room
      getMessages(user, room)
      break

    case 'get-all-messages':
      user = payload.user
      rooms = payload.rooms
      getAllMessages(user, rooms)
      break

    case 'get-previous-messages':
      user = payload.user
      room = payload.room
      scroll_height = payload.scroll_height
      getPreviousMessages(user, room, scroll_height)
      break

    case 'create-contacts':
      user = payload.user
      contacts = payload.contacts
      module_type = payload.module_type
      createContacts(user, contacts, module_type)
      break

    case 'edit-contact':
      user = payload.user
      contact = payload.contact
      module_type = payload.module_type
      editContact(user, contact, module_type)
      break

    case 'delete-contact':
      user = payload.user
      contact_id = payload.contact_id
      deleteContact(user, contact_id)
      break

    case 'add-contact':
      contact = payload.contact
      module_type = payload.module_type
      addContact(contact, module_type)
      break

    case 'remove-contact':
      contact_id = payload.contact_id
      module_type = payload.module_type
      removeContact(contact_id, module_type)
      break

    case 'search-listing':
      user = payload.user
      q = payload.q
      searchListing(user, q)
      break

    case 'room-notifications':
      user = payload.user
      id = payload.id
      notification = payload.notification
      setNotification(user, id, notification)
      break

    case 'upload-files-to-room':
      uploadFilesToRoom(payload.user, payload.room, payload.files)
      break

    default:
      return true

  }

  return true
})

export default AppDispatcher