import { combineReducers } from 'redux'
import signin from './signin'
import resetPassword from './password/reset'
import forgotPassword from './password/forgot'

const auth = combineReducers({
  signin,
  resetPassword,
  forgotPassword
})

export default auth
