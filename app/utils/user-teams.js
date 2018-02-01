import cookie from 'js-cookie'

const ACTIVE_TEAM_COOKIE = 'rechat-active-team'

export function getActiveTeam(user) {
  const { teams } = user

  if (!teams || !user.brand) {
    return []
  }

  return teams.find(team => team.brand.id === getActiveTeamId(user))
}

export function getActiveTeamACL(user) {
  // const team = getActiveTeam(user)
  // return team && team.acl ? team.acl : []

  const { roles } = user

  if (!roles || !user.brand) {
    return []
  }

  const role = roles.find(role => role.brand === user.brand)

  return role && role.acl ? role.acl : []
}

export function hasUserAccess(user, action) {
  return getActiveTeamACL(user).includes(action)
}

export function getActiveTeamId(user) {
  return cookie.get(ACTIVE_TEAM_COOKIE) || user.brand
}

export function setActiveTeam(id) {
  cookie.set(ACTIVE_TEAM_COOKIE, id, {
    path: '/',
    expires: 360
  })
}
