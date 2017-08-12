import { combineReducers } from 'redux'
import { SIGNIN_SUCCESS } from '../../constants/auth/signin'

const user = (state = {}, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user
    default:
      return state
  }
}

export default user
