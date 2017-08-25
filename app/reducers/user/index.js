import { combineReducers } from 'redux'
import { EDIT_USER_SUCCESS } from '../../constants/user'
import { SIGNIN_SUCCESS } from '../../constants/auth/signin'

const user = (state = {}, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user
    case EDIT_USER_SUCCESS:
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}

export default user
