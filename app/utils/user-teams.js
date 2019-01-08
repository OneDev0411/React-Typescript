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

export function isBackOffice(user) {
  return hasUserAccess(user, 'BackOffice')
}

export function viewAs(user, activeTeam = getActiveTeam(user)) {
  if (!idx(activeTeam, t => t.acl.includes('BackOffice')) && idx(activeTeam, team => team.settings.user_filter[0])) {
    return activeTeam.settings.user_filter
  }
  
  return []
}

export function viewAsEveryoneOnTeam(user) {
  const users = viewAs(user)
  return users.length === 0 ||
    allMembersOfTeam(getActiveTeam(user)).length === users.length
}

export function allMembersOfTeam(team) {
  const members =
    team && team.brand.roles
      ? team.brand.roles.reduce(
          (members, role) =>
            role.members ? members.concat(role.members) : members,
          []
        )
      : []

  const indexedMembers = {}

  members.forEach(m => {
    indexedMembers[m.id] = m
  })

  return Object.values(indexedMembers)
}

export function isTrainingAccount(user) {

  // Hide training banner
  // https://gitlab.com/rechat/web/issues/1688#note_104530885
  return false
  
  const activeTeam = getActiveTeam(user) || {}
  let { brand } = activeTeam

  if (!activeTeam || !brand) {
    return false
  }

  do {
    if (brand.training) {
      return true
    }

    brand = brand.parent
  } while (brand)

  return false
}