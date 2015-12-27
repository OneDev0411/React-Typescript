// AppDispatcher.js
import { Dispatcher } from 'flux'

// User
import signup from '../actions/user/signup'
import signin from '../actions/user/signin'
import forgotPassword from '../actions/user/forgot-password'
import resetPassword from '../actions/user/reset-password'
import verifyPhone from '../actions/user/verify-phone'
import addUserToStore from '../actions/user/add-user-to-store'
import getUserRooms from '../actions/user/get-user-rooms'

// Rooms
import createRoom from '../actions/rooms/create-room'

// Messages
import createMessage from '../actions/messages/create-message'
import getMessages from '../actions/messages/get-messages'
import getPreviousMessages from '../actions/messages/get-previous-messages'

// Pages
import showModal from '../actions/pages/show-modal'
import landingPage from '../actions/pages/landing'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {
  const action = payload.action

  // Vars
  let user
  let invite
  let room_id
  let room
  let comment
  let email
  let password
  let confirm_password
  let redirect_to
  let token
  let code
  let modal_key
  let title
  let scroll_height

  switch (action) {

    case 'init-landing':
      landingPage.init(payload.random_number)
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

    case 'get-user-rooms':
      user = payload.user
      room_id = payload.room_id
      getUserRooms(user, room_id)
      break

    case 'create-message':
      user = payload.user
      room = payload.room
      comment = payload.comment
      createMessage(user, room, comment)
      break

    case 'get-messages':
      user = payload.user
      room = payload.room
      getMessages(user, room)
      break

    case 'get-previous-messages':
      user = payload.user
      room = payload.room
      scroll_height = payload.scroll_height
      getPreviousMessages(user, room, scroll_height)
      break

    case 'show-modal':
      modal_key = payload.modal_key
      showModal(modal_key)
      break

    default:
      return true

  }

  return true
})

export default AppDispatcher