import { groupBy, flatten } from 'lodash'

import { ITeam, ITeamRole } from 'models/BrandConsole/types'

export function getTeamUsers(team: ITeam) {
  const roles = (team.roles || []).filter(role => !role.deleted_at)

  const allRoleUsers = flatten(roles.map(role => role.users || []))

  return Object.values(groupBy(allRoleUsers, roleUser => roleUser.user.id)).map(
    roleUserArray => ({
      user: roleUserArray[0].user,
      roles: roleUserArray
        .filter(roleUser => !roleUser.deleted_at)
        .map(roleUser => roles.find(role => role.id === roleUser.role))
        .filter(i => i != undefined) as ITeamRole[]
    })
  )
}
