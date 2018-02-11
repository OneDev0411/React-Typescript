import cookie from 'js-cookie'

const ACTIVE_TEAM_COOKIE = 'rechat-active-team'

export function getActiveTeam(user) {
  const { teams } = user

  if (!teams) {
    return []
  }

  return teams.find(team => team.brand.id === getActiveTeamId(user))
}

export function getActiveTeamACL(user) {
  const team = getActiveTeam(user)

  return team && team.acl ? team.acl : []
}

export function hasUserAccess(user, action) {
  return getActiveTeamACL(user).includes(action)
}

export function getActiveTeamId(user) {
  const id = cookie.get(ACTIVE_TEAM_COOKIE) || user.activeTeam || user.brand

  if (!id && user.teams) {
    return user.teams[0].brand.id
  }

  return id
}

export function setActiveTeam(id) {
  cookie.set(ACTIVE_TEAM_COOKIE, id, {
    path: '/',
    expires: 360
  })
}
