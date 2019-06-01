import cookie from 'js-cookie'
import idx from 'idx'

function getActiveTeamFromCookieOrUser(user) {
  return user.active_brand || user.brand || cookie.get('rechat-active-team')
}

export function getActiveTeam(user = {}) {
  const { teams } = user

  if (!teams) {
    return null
  }

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromCookieOrUser(user)
  )

  if (!activeTeam && teams) {
    activeTeam = user.teams[0]
  }

  return activeTeam
}

export function getActiveTeamId(user) {
  if (user.active_brand) {
    return user.active_brand
  }
  
  const activeTeam = getActiveTeam(user)

  if (!activeTeam) {
    return user.brand
  }

  return activeTeam.brand.id
}

export function getActiveTeamACL(user) {
  const team = getActiveTeam(user)

  return team && team.acl ? team.acl : []
}

export function isSoloActiveTeam(user) {
  const team = getActiveTeam(user)

  return team.brand && team.brand.member_count === 1
}

export function hasUserAccess(user, action) {
  return getActiveTeamACL(user).includes(action)
}

export function hasUserAccessToDeals(user) {
  return hasUserAccess(user, 'Deals') || isBackOffice(user)
}

export function hasUserAccessToCrm(user) {
  return hasUserAccess(user, 'CRM')
}

export function isBackOffice(user) {
  return hasUserAccess(user, 'BackOffice')
}

export function viewAs(user, activeTeam = getActiveTeam(user)) {
  if (!idx(activeTeam, t => t.acl.includes('BackOffice')) && idx(activeTeam, team => team.settings.user_filter[0])) {
    return activeTeam.settings.user_filter
  }
  
  return []
}

export function getActiveTeamSettings(user, key = null) {
  const team = getActiveTeam(user)
  const settings = team.settings || {}
  return key ? settings[key] : settings
}

export function viewAsEveryoneOnTeam(user) {
  const users = viewAs(user)
  return users.length === 0 ||
    getTeamAvailableMembers(getActiveTeam(user)).length === users.length
}

export function getTeamAvailableMembers(team) {
  return team && team.brand ? getBrandAvailableMembers(team.brand) : []
}

export function getBrandAvailableMembers(brand) {
  return brand && brand.roles
      ? brand.roles.reduce(
          (members, role) =>
            Array.isArray(role.users) && role.users.length > 0 ? [...members, ...getRoleNotDeletedUsers(role)] : members,
          []
        )
      : []
}

export function getRoleNotDeletedUsers(role) {
  return role.users.filter(({ deleted_at }) => deleted_at == null).map(({ user }) => user )
}
