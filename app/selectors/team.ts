import { createSelector } from 'reselect'

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

/**
 * Returns the active team id for the current user if exists
 * @param state The app state
 */
export function selectActiveTeamIdUnsafe(state: IAppState): Nullable<UUID> {
  return selectActiveTeamUnsafe(state)?.id || null
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
 * Returns the active user team brands
 * @param state The app state
 */
export const selectActiveTeamBrands = createSelector<
  IAppState,
  IUserTeam,
  IBrand[]
>(selectActiveTeam, team => {
  const brands: IBrand[] = []

  let brand: Nullable<IBrand> = team.brand

  while (brand) {
    brands.push(brand)
    brand = brand.parent
  }

  return brands
})

/**
 * Returns the active team roles for the current user if exists
 * @param state The app state
 */
export function selectActiveTeamRolesUnsafe(
  state: IAppState
): Optional<IBrandRole[]> {
  return selectActiveTeamUnsafe(state)?.brand.roles
}

/**
 * Returns the active team roles for the current user or throw an error
 * if there is no active team roles
 * @param state The app state
 */
export function selectActiveTeamRoles(state: IAppState): IBrandRole[] {
  const activeTeamRoles = selectActiveTeamRolesUnsafe(state)

  if (!activeTeamRoles) {
    throw new Error('The current user does not have an active team roles')
  }

  return activeTeamRoles
}

/**
 * Returns the permission for the current active team
 * @param state The app state
 */
export function selectActiveTeamACL(state: IAppState): IUserTeam['acl'] {
  return selectActiveTeamUnsafe(state)?.acl ?? []
}
