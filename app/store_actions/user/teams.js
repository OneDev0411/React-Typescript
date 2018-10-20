import * as actionsType from '../../constants/user'
import getTeams from '../../models/user/get-teams'

export default function getUserTeams(user = {}, fetchMembers) {
  return async dispatch => {
    const teams = await getTeams(user, fetchMembers)

    fetchMembers &&
      teams.forEach(({ brand }) => {
        brand.roles = brand.roles || []
        brand.roles.forEach(role => (role.members = role.members || []))
      })

    dispatch({
      type: actionsType.SET_USER_TEAMS,
      teams
    })

    return teams
  }
}
