import { IAppState } from 'reducers'

/**
 * Returns the active team for the current user if exists
 * @param state The app state
 */
export const selectActiveTeamUnsafe = (state: IAppState): Nullable<IUserTeam> =>
  state.activeTeam

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
