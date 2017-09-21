import { combineReducers } from 'redux'
import { SIGNIN_SUCCESS } from '../../constants/auth/signin'
import { EDIT_USER_SUCCESS, UPLOAD_AVATAR_SUCCESS } from '../../constants/user'

const user = (state = null, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user
    case EDIT_USER_SUCCESS:
    case UPLOAD_AVATAR_SUCCESS:
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}

export default user
