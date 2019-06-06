import { groupBy, flatten } from 'lodash'

import { notDeleted } from 'utils/not-deleted'

export interface UserWithRoles {
  user: IUser
  roles: IBrandRole[]
}
export function getTeamUsersWithRoles(team: IBrand): UserWithRoles[] {
  const roles = (team.roles || []).filter(notDeleted)

  const allRoleUsers = flatten(roles.map(role => role.users || []))

  return Object.values(groupBy(allRoleUsers, roleUser => roleUser.user.id)).map(
    roleUserArray => ({
      user: roleUserArray[0].user,
      roles: roleUserArray
        .filter(notDeleted)
        .map(roleUser => roles.find(role => role.id === roleUser.role))
        .filter(i => i != undefined) as IBrandRole[]
    })
  )
}
