import idx from 'idx'
import { flatMap, identity, uniqBy } from 'lodash'

import { DEFAULT_BRAND_PALETTE } from './constants'
import flattenBrand from './flatten-brand'
import { notDeleted } from './not-deleted'

function getActiveTeamFromUser(user) {
  return user.active_brand || user.brand
}

export function getActiveTeam(user: Partial<IUser> | null): IUserTeam | null {
  if (user == null || user.teams == null) {
    return null
  }

  const { teams } = user

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromUser(user)
  )

  if (!activeTeam && teams) {
    activeTeam = teams[0]
  }

  return activeTeam || null
}

export function getActiveTeamId(user: IUser | null): UUID | null {
  if (user == null) {
    return null
  }

  if (user.active_brand) {
    return user.active_brand
  }

  const activeTeam = getActiveTeam(user)

  if (!activeTeam) {
    return user.brand
  }

  return activeTeam.brand.id
}

export function isSoloActiveTeam(team: Nullable<IUserTeam>): boolean {
  if (!team) {
    return false
  }

  return !!(team.brand && team.brand.member_count === 1)
}

export function isActiveTeamTraining(team: Nullable<IUserTeam>): boolean {
  if (!team) {
    return false
  }

  let current: IBrand = team.brand

  do {
    if (current.training) {
      return true
    }

    current = current.parent as IBrand
  } while (current != null)

  return false
}

export function viewAs(
  user: IUser | null,
  shouldReturnAll: boolean = false,
  team: IUserTeam | null = getActiveTeam(user)
): UUID[] {
  if (!team) {
    return []
  }

  const allTeamMember = getTeamAvailableMembers(team)
  const allTeamMemberIds = allTeamMember.map(t => t.id)

  if (!idx(team, t => t.acl.includes('BackOffice'))) {
    const selectedViewAsUsers = (team.settings?.user_filter || []).filter(m =>
      allTeamMemberIds.includes(m)
    )

    if (
      !selectedViewAsUsers[0] ||
      (!shouldReturnAll && allTeamMember.length === selectedViewAsUsers.length)
    ) {
      return allTeamMemberIds
    }

    return selectedViewAsUsers
  }

  return allTeamMemberIds
}

type GetSettings = (
  team: IUserTeam,
  includesParents?: boolean
) => StringMap<any>

export const getSettingsFromActiveTeam =
  (getSettings: GetSettings) =>
  (user: IUser | null, includesParents?: boolean) => {
    const team = getActiveTeam(user)

    if (!team) {
      return {}
    }

    return getSettings(team, includesParents)
  }

export const getUserSettingsInActiveTeam = (user: IUser, key: string): any => {
  return getSettingsFromActiveTeam(team => {
    return team?.settings?.[key]
  })(user)
}

export function getActiveTeamPalette(team: IUserTeam): BrandMarketingPalette {
  if (!team || !team.brand) {
    return DEFAULT_BRAND_PALETTE
  }

  const brand = flattenBrand(team.brand)

  if (!brand || !brand.settings || !brand.settings.marketing_palette) {
    return DEFAULT_BRAND_PALETTE
  }

  return brand.settings.marketing_palette
}

export function viewAsEveryoneOnTeam(user: IUser | null): boolean {
  if (user == null) {
    return false
  }

  const users = viewAs(user, true)

  return (
    // It means all members of the team
    users == null ||
    users.length === 0 ||
    getTeamAvailableMembers(getActiveTeam(user)).length === users.length
  )
}

export function getTeamAvailableMembers(team: IUserTeam | null) {
  return team && team.brand ? getBrandUsers(team.brand) : []
}

export function getRoleUsers(role: IBrandRole, includeDeletedUsers = false) {
  return (role.users || [])
    .filter(includeDeletedUsers ? identity : notDeleted)
    .map(roleUser => roleUser.user)
}

export function getBrandUsers(
  brand: IBrand,
  includeDeletedUsers = false
): IUser[] {
  return uniqBy(
    flatMap(
      (brand.roles || [])
        .filter(notDeleted)
        .map(role => getRoleUsers(role, includeDeletedUsers))
    ),
    'id'
  )
}

export function getUserRoles(team: IBrand, userId: string) {
  return (team.roles || []).filter(
    role =>
      notDeleted(role) &&
      (role.users || []).find(
        roleUser => notDeleted(roleUser) && roleUser.user.id === userId
      )
  )
}

export function getBrandByType(
  user: IUser | null,
  type: IBrandType
): IBrand | null {
  const team = getActiveTeam(user)

  if (team === null) {
    return null
  }

  let brand: IBrand | null = team.brand

  do {
    if (brand.brand_type === type) {
      return brand
    }

    brand = brand.parent
  } while (brand)

  return null
}

export function getRootBrand(user: IUser | null): IBrand | null {
  const team = getActiveTeam(user)

  if (team === null) {
    return null
  }

  let brand: IBrand | null = team.brand

  while (brand && brand.parent) {
    brand = brand.parent
  }

  return brand
}
