import { SIGNIN_SUCCESS } from '../../constants/auth/signin'
import {
  UPDATE_USER,
  SET_USER_TEAMS,
  EDIT_USER_SUCCESS,
  UPLOAD_AVATAR_SUCCESS,
  SET_USER_BRAND_MEMBERS,
  UPGRADE_TO_AGENT_SUCCESS,
  UPLOAD_COVER_IMAGE_SUCCESS
} from '../../constants/user'

const user = (state = null, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user
    case SET_USER_TEAMS:
      return {
        ...state,
        teams: action.teams
      }

    case SET_USER_BRAND_MEMBERS:
      const teamIndex = state.teams.findIndex(
        team => team.brand.id === action.brand.id
      )

      return {
        ...state,
        teams: state.teams.map(
          (team, index) =>
            index !== teamIndex
              ? team
              : {
                  ...state.teams[teamIndex],
                  brand: action.brand
                }
        )
      }

    case UPDATE_USER:
    case EDIT_USER_SUCCESS:
    case UPLOAD_AVATAR_SUCCESS:
    case UPGRADE_TO_AGENT_SUCCESS:
    case UPLOAD_COVER_IMAGE_SUCCESS:
      return {
        ...state,
        ...action.user
      }
    default:
      return state
  }
}

export default user
