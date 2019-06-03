import {
  FETCH_USER_TEAMS_REQUEST,
  FETCH_USER_TEAMS_SUCCESS,
  FETCH_USER_TEAMS_FAILURE
} from '../../constants/user'
import { getTeams } from '../../models/user/get-teams'

export function getUserTeams(user = {}, fetchMembers) {
  return async dispatch => {
    dispatch({
      type: FETCH_USER_TEAMS_REQUEST
    })

    try {
      const teams = await getTeams(user, fetchMembers)

      dispatch({
        type: FETCH_USER_TEAMS_SUCCESS,
        teams
      })

      return teams
    } catch (error) {
      dispatch({
        type: FETCH_USER_TEAMS_FAILURE
      })
    }
  }
}
