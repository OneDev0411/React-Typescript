import cookie from 'js-cookie'
import idx from 'idx'
import { notDeleted } from './not-deleted'
import { flatMap, identity, uniqBy } from 'lodash'

import { ACL } from '../constants/acl'

function getActiveTeamFromCookieOrUser(user) {
  return user.active_brand || user.brand || cookie.get('rechat-active-team')
}

export function getActiveTeam(user: Partial<IUser> | null): IUserTeam | null {
  if (user == null || user.teams == null) {
    return null
  }

  const { teams } = user

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromCookieOrUser(user)
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

export function getActiveTeamACL(user: IUser | null): string[] {
  const team = getActiveTeam(user)

  return team && team.acl ? team.acl : []
}

export function isSoloActiveTeam(user: IUser | null): boolean {
  const team = getActiveTeam(user)

  return !!(team && team.brand && team.brand.member_count === 1)
}

export function hasUserAccess(
  user: IUser | null,
  access: IPermission,
  accessControlPolicy: IAccessControlPolicy = 'ActiveTeam'
): boolean {
  if (user == null) {
    return false
  }

  const team = getActiveTeam(user)

  let brand: IBrand | null = team && team.brand

  while (brand) {
    const brandId = brand.id
    const userTeam = (user.teams || []).find(team => team.brand.id === brandId)

    if (
      // If policy is Root, we only accept access if we have reached the root brand
      (accessControlPolicy !== 'Root' || !brand.parent) &&
      userTeam &&
      (userTeam.acl || []).includes(access)
    ) {
      return true
    }
    // If policy is ActiveTeam, don't need to traverse the tree up
    if (accessControlPolicy === 'ActiveTeam') {
      break
    }
    brand = brand.parent
  }

  return false
}

export function hasUserAccessToDeals(user: IUser | null): boolean {
  return hasUserAccess(user, ACL.DEALS) || isBackOffice(user)
}

export function hasUserAccessToCrm(user: IUser | null): boolean {
  return hasUserAccess(user, ACL.CRM)
}

export function hasUserAccessToMarketingCenter(user: IUser | null): boolean {
  return hasUserAccess(user, ACL.MARKETING)
}

export function isBackOffice(user: IUser | null): boolean {
  return hasUserAccess(user, ACL.BACK_OFFICE)
}

export function isActiveTeamTraining(user: IUser | null): boolean {
  const activeTeam: IUserTeam | null = getActiveTeam(user)

  if (!activeTeam) {
    return false
  }

  let current: IBrand = activeTeam.brand

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
  activeTeam: IUserTeam | null = getActiveTeam(user)
) {
  if (
    activeTeam &&
    !idx(activeTeam, t => t.acl.includes('BackOffice')) &&
    idx(activeTeam, team => team.settings.user_filter[0])
  ) {
    return activeTeam.settings.user_filter
  }

  return []
}

type GetSettings = (team: IUserTeam) => StringMap<any> | null

const getSettingsFromActiveTeam = (getSettings: GetSettings) => (
  user: IUser | null,
  key: string
) => {
  const team = getActiveTeam(user)
  const settings = (team && getSettings(team)) || {}

  // console.log('team', team)
  // console.log('teamsettings', getSettings(team))

  return key ? settings[key] : settings
}

export const getActiveTeamSettings = getSettingsFromActiveTeam(
  team => team.brand.settings
)

export const getUserSettingsInActiveTeam = getSettingsFromActiveTeam(
  team => team.settings
)

export function viewAsEveryoneOnTeam(user: IUser | null): boolean {
  if (user == null) {
    return false
  }

  const users = viewAs(user)

  return (
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
  team: IBrand,
  includeDeletedUsers = false
): IUser[] {
  return uniqBy(
    flatMap(
      (team.roles || [])
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
