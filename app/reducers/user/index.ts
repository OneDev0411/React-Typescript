import { SIGNIN_SUCCESS } from '@app/constants/auth/signin'
import * as actionTypes from '@app/constants/user'

export type IUserState = Nullable<IUser>

// TODO: the second parameter needs to be type safe later
const userReducer = (state: IUserState = null, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user

    case actionTypes.SET_USER_AND_ACTIVE_TEAM:
      return action.payload.user

    case actionTypes.UPDATE_USER:
    case actionTypes.EDIT_USER_SUCCESS:
    case actionTypes.UPLOAD_AVATAR_SUCCESS:
    case actionTypes.UPGRADE_TO_AGENT_SUCCESS:
    case actionTypes.UPLOAD_COVER_IMAGE_SUCCESS:
      return {
        ...state,
        ...action.user
      }
    case actionTypes.DISCONNECT_DOCUSIGN:
      return {
        ...state,
        docusign: null
      }
    default:
      return state
  }
}

export default userReducer
