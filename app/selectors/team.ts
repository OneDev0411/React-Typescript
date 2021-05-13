import { IAppState } from 'reducers'
import {
  getActiveTeam,
  getActiveTeamId,
  getTeamAvailableMembers
} from 'utils/user-teams'

import { selectUser } from './user'

/**
 * Returns the active team id for the current user if exists
 * @param state The app state
 */
export function selectActiveTeamIdUnsafe(state: IAppState): Nullable<UUID> {
  return getActiveTeamId(selectUser(state))
}

/**
 * Returns the active team id for the current user or throw an error
 * if there is no active team
 * @param state The app state
 */
export function selectActiveTeamId(state: IAppState): UUID {
  const activeTeamId = selectActiveTeamIdUnsafe(state)

  if (!activeTeamId) {
    throw new Error('The current user does not have an active team')
  }

  return activeTeamId
}

/**
 * Returns the active team for the current user if exists
 * @param state The app state
 */
export function selectActiveTeamUnsafe(state: IAppState): Nullable<IUserTeam> {
  return getActiveTeam(selectUser(state))
}

/**
 * Returns the active team for the current user or throw an error
 * if there is no active team
 * @param state The app state
 */
export function selectActiveTeam(state: IAppState): IUserTeam {
  const activeTeam = selectActiveTeamUnsafe(state)

  if (!activeTeam) {
    throw new Error('The current user does not have an active team')
  }

  return activeTeam
}

/**
 * Returns the available members for the current active team
 * @param state The app state
 */
export function selectActiveTeamAvailableMembers(state: IAppState): IUser[] {
  return getTeamAvailableMembers(selectActiveTeamUnsafe(state))
}
