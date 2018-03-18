import cookie from 'js-cookie'

const ACTIVE_TEAM_COOKIE = 'rechat-active-team'

export function getActiveTeam(user) {
  console.log('>>>>', user)

  const { teams } = user

  if (!teams) {
    return []
  }

  let activeTeam = teams.find(
    team => team.brand.id === getActiveTeamFromCookieOrUser(user)
  )

  if (!activeTeam && user.brand) {
    activeTeam = user.teams[0]
    setActiveTeam(activeTeam.id)
  }

  return activeTeam
}

export function getActiveTeamId(user) {
  // const id = getActiveTeamFromCookieOrUser(user)
  // if (!id && user.teams && user.brand) {
  //   return user.teams[0].brand.id
  // } else if (!user.teams) {
  //   return user.brand
  // }
  // let activeTeam = user.teams.find(team => team.brand.id === id)
  // if (activeTeam) {
  //   return id
  // }
  // return user.teams[0].brand.id
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
