import { SIGNIN_SUCCESS } from '../../constants/auth/signin'
import * as actionTypes from '../../constants/user'

export type IUserState = Nullable<IUser>

// TODO: the second parameter needs to be type safe later
const userReducer = (state: IUserState = null, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user

    case actionTypes.SET_USER_SETTING:
      return {
        ...state,
        teams: action.user.teams
      }

    case actionTypes.FETCH_USER_TEAMS_SUCCESS:
      return {
        ...state,
        teams: action.teams,
        is_fetching_teams: false
      }

    case actionTypes.FETCH_USER_TEAMS_REQUEST:
      return {
        ...state,
        is_fetching_teams: true
      }

    case actionTypes.FETCH_USER_TEAMS_FAILURE:
      return {
        ...state,
        is_fetching_teams: false
      }

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

export const isFetchingSelectedTeam = state => state.is_fetching_teams
