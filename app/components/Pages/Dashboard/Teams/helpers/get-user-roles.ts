import { ITeam } from 'models/BrandConsole/types'
import { notDeleted } from 'utils/not-deleted'

export function getUserRoles(team: ITeam, userId: string) {
  return (team.roles || []).filter(
    role =>
      notDeleted(role) &&
      (role.users || []).find(
        roleUser => notDeleted(roleUser) && roleUser.user.id === userId
      )
  )
}
