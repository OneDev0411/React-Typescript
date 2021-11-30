import { Dispatch } from 'redux'

import { getActiveTeam } from '@app/models/user/get-active-team'
import { ACTIVE_TEAM_REQUEST, SET_ACTIVE_TEAM } from 'constants/user'

const requestActiveTeam = () =>
  ({
    type: ACTIVE_TEAM_REQUEST
  } as const)

export type RequestActiveTeamAction = ReturnType<typeof requestActiveTeam>

const setActiveTeam = (team: IUserTeam) =>
  ({
    type: SET_ACTIVE_TEAM,
    payload: team
  } as const)

export type SetActiveTeamAction = ReturnType<typeof setActiveTeam>

export const fetchActiveTeam = () => async (dispatch: Dispatch) => {
  try {
    const activeTeam = await getActiveTeam()

    dispatch(setActiveTeam(activeTeam))
  } catch (error) {
    console.error(error)
  }
}
