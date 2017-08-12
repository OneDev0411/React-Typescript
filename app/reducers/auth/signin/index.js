import { combineReducers } from 'redux'
import { reducer as reduxFormReducer } from 'redux-form'
import {
  SIGNIN_REQUEST,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE
} from '../../../constants/auth/signin'

export const isLogging = (state = false, action) => {
  switch (action.type) {
    case SIGNIN_REQUEST:
      return true
    case SIGNIN_SUCCESS:
    case SIGNIN_FAILURE:
      return false
    default:
      return state
  }
}

export const error = (state = null, action) => {
  switch (action.type) {
    case SIGNIN_FAILURE:
      return action.error
    case SIGNIN_REQUEST:
    case SIGNIN_SUCCESS:
      return null
    default:
      return state
  }
}

const signin = combineReducers({
  error,
  isLogging,
  form: reduxFormReducer
})

export default signin
