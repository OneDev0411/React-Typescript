// AppDispatcher.js
import { Dispatcher } from 'flux'
import AppStore from '../stores/AppStore'
import signup from '../actions/signup'
import signin from '../actions/signin'
import forgotPassword from '../actions/forgot-password'
import resetPassword from '../actions/reset-password'
import verifyPhone from '../actions/verify-phone'
import getRooms from '../actions/get-rooms'
import showModal from '../actions/show-modal'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {

  let action = payload.action

  // Vars
  let user
  let email
  let password
  let confirm_password
  let redirect_to
  let token
  let access_token
  let code
  let modal_key

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

    case 'get-rooms':
      access_token = payload.access_token
      getRooms(access_token)
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