// AppDispatcher.js
import { Dispatcher } from 'flux'
import AppStore from '../stores/AppStore'
import signin from '../actions/signin'
import forgotPassword from '../actions/forgot-password'
import resetPassword from '../actions/reset-password'
import getRooms from '../actions/get-rooms'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {

  let action = payload.action
  let email
  let password
  let confirm_password
  let redirect_to
  let token
  let access_token

  switch(action) {

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

    case 'get-rooms':
      access_token = payload.access_token
      getRooms(access_token)
      break

    default:
      return true

  }

  return true

})

export default AppDispatcher