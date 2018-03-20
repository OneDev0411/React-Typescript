import cookie from 'js-cookie'

const ACTIVE_TEAM_COOKIE = 'rechat-active-team'

export function getActiveTeam(user) {
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

export function hasUserAccess(user, action) {
  return getActiveTeamACL(user).includes(action)
}

function getActiveTeamFromCookieOrUser(user) {
  return cookie.get(ACTIVE_TEAM_COOKIE) || user.activeTeam || user.brand
}

export function setActiveTeam(id) {
  cookie.set(ACTIVE_TEAM_COOKIE, id, {
    path: '/',
    expires: 360
  })
}
