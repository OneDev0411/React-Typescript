// AppDispatcher.js
import { Dispatcher } from 'flux'
import AppStore from '../stores/AppStore'
import signin from '../actions/signin'
import forgotPassword from '../actions/forgot-password'
import getRooms from '../actions/get-rooms'

const AppDispatcher = new Dispatcher()

// Register callback with AppDispatcher
AppDispatcher.register(payload => {

  let action = payload.action
  let email
  
  switch(action) {

    case 'sign-in':
      email = payload.email
      let password = payload.password
      let redirect_to = payload.redirect_to
      signin(email, password, redirect_to)
      break

    case 'forgot-password':
      email = payload.email
      forgotPassword(email)
      break

    case 'get-rooms':
      let access_token = payload.access_token
      getRooms(access_token)
      break

    default:
      return true

  }

  return true

})

export default AppDispatcher