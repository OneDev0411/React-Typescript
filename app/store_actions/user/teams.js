import {
  FETCH_USER_TEAMS_REQUEST,
  FETCH_USER_TEAMS_SUCCESS,
  FETCH_USER_TEAMS_FAILURE
} from '../../constants/user'
import getTeams from '../../models/user/get-teams'

export default function getUserTeams(user = {}, fetchMembers) {
  return async dispatch => {
    dispatch({
      type: FETCH_USER_TEAMS_REQUEST
    })

    try {
      const teams = await getTeams(user, fetchMembers)

      fetchMembers &&
        teams.forEach(({ brand }) => {
          brand.roles = brand.roles || []
          brand.roles.forEach(role => (role.members = role.members || []))
        })

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
