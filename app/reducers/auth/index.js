import { combineReducers } from 'redux'
import signin from './signin'
import signup from './signup'
import resetPassword from './password/reset'
import forgotPassword from './password/forgot'

const auth = combineReducers({
  signin,
  signup,
  resetPassword,
  forgotPassword
})

export default auth
