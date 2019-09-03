import cookie from 'js-cookie'
import idx from 'idx'
import { notDeleted } from './not-deleted'
import { flatMap, identity, uniqBy } from 'lodash'

import { ACL } from '../constants/acl'

function getActiveTeamFromCookieOrUser(user) {
  return user.active_brand || user.brand || cookie.get('rechat-active-team')
}

export function getActiveTeam(user: Partial<IUser> = {}): IUserTeam | null {
  const { teams } = user

  if (!teams) {
    return null
  }

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromCookieOrUser(user)
  )

  if (!activeTeam && teams) {
    activeTeam = teams[0]
  }

  return activeTeam || null
}

export function getActiveTeamId(user: IUser): UUID | null {
  if (user.active_brand) {
    return user.active_brand
  }

  const activeTeam = getActiveTeam(user)

  if (!activeTeam) {
    return user.brand
  }

  return activeTeam.brand.id
}

export function getActiveTeamACL(user: IUser): string[] {
  const team = getActiveTeam(user)

  return team && team.acl ? team.acl : []
}

export function isSoloActiveTeam(user): boolean {
  const team = getActiveTeam(user)

  return !!(team && team.brand && team.brand.member_count === 1)
}

export function hasUserAccess(user: IUser, access: string) {
  return getActiveTeamACL(user).includes(access)
}

export function hasUserAccessToDeals(user: IUser): boolean {
  return hasUserAccess(user, ACL.DEALS) || isBackOffice(user)
}

export function hasUserAccessToCrm(user: IUser): boolean {
  return hasUserAccess(user, ACL.CRM)
}

export function hasUserAccessToMarketingCenter(user: IUser): boolean {
  return hasUserAccess(user, ACL.MARKETING)
}

export function isBackOffice(user): boolean {
  return hasUserAccess(user, ACL.BACK_OFFICE)
}

export function isActiveTeamTraining(user): boolean {
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

export function viewAs(user, activeTeam = getActiveTeam(user)) {
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

const getSettingsFromActiveTeam = (getSettings: GetSettings) => (user: IUser, key: string) => {
  const team = getActiveTeam(user)
  const settings = (team && getSettings(team)) || {}
  return key ? settings[key] : settings
}

export const getActiveTeamSettings = getSettingsFromActiveTeam(team => team.brand_settings)
export const getUserSettingsInActiveTeam = getSettingsFromActiveTeam(team => team.settings)


export function viewAsEveryoneOnTeam(user: IUser): boolean {
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

export function getBrandByType(user: IUser, type: IBrandType): IBrand | null {
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

export function getRootBrand(user: IUser) {
  const team = getActiveTeam(user)
  if (team === null) {
    return null
  }

  let brand: IBrand | null = team.brand

  while(brand && brand.parent) {
    brand = brand.parent
  }
  return brand

}
