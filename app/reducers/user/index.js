import { SIGNIN_SUCCESS } from '../../constants/auth/signin'
import * as actionTypes from '../../constants/user'

const user = (state = null, action) => {
  switch (action.type) {
    case SIGNIN_SUCCESS:
      return action.user
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

    case actionTypes.SET_USER_BRAND_MEMBERS:
      const teamIndex = state.teams.findIndex(
        team => team.brand.id === action.brand.id
      )

      return {
        ...state,
        teams: state.teams.map((team, index) =>
          index !== teamIndex
            ? team
            : {
                ...state.teams[teamIndex],
                brand: action.brand
              }
        )
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
    default:
      return state
  }
}

export default user

export const isFetchingSelectedTeam = state => state.is_fetching_teams
