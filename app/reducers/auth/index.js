import { combineReducers } from 'redux'
import signin from './signin'
import forgotPassword from './password/forgot'

const auth = combineReducers({
  signin,
  forgotPassword
})

export default auth
