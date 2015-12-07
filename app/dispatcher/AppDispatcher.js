// AppDispatcher.js
import { Dispatcher } from 'flux'

// AppStore
import AppStore from '../stores/AppStore'

// User
import signup from '../actions/signup'
import signin from '../actions/signin'
import forgotPassword from '../actions/forgot-password'
import resetPassword from '../actions/reset-password'
import verifyPhone from '../actions/verify-phone'
import addUserToStore from '../actions/add-user-to-store'

// Rooms
import getRooms from '../actions/get-rooms'
import createRoom from '../actions/create-room'

import showModal from '../actions/show-modal'

// Messages
import createMessage from '../actions/create-message'
import getMessages from '../actions/get-messages'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {

  let action = payload.action

  // Vars
  let user
  let room
  let comment
  let email
  let password
  let confirm_password
  let redirect_to
  let token
  let access_token
  let code
  let modal_key
  let title

  switch(action) {

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
      signin(email, password, redirect_to)
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
      getRooms(user)
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