import * as actionsType from '../../constants/user'
import getTeams from '../../models/user/get-teams'

export default function getUser(user = {}) {
  return async dispatch => {
    const teams = await getTeams(user)

    dispatch({
      type: actionsType.SET_USER_TEAMS,
      teams
    })

    return teams
  }
}
