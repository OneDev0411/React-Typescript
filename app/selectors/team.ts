import { IAppState } from 'reducers'
import { getActiveTeamId } from 'utils/user-teams'

import { selectUser } from './user'

/**
 * Returns the active team id for the current user if exists
 * @param state The app state
 */
export const selectActiveTeamIdUnsafe = (state: IAppState) =>
  getActiveTeamId(selectUser(state))

/**
 * Returns the active team id for the current user or throw an error
 * if there is no active team
 * @param state The app state
 */
export const selectActiveTeamId = (state: IAppState) => {
  const activeTeamId = selectActiveTeamIdUnsafe(state)

  if (!activeTeamId) {
    throw new Error('The current user does not have an active team')
  }

  return activeTeamId
}
