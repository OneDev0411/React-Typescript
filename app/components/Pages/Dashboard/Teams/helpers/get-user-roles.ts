import { ITeam } from 'models/BrandConsole/types'

export function getUserRoles(team: ITeam, userId: string) {
  return team.roles!.filter(role =>
    role.users!.find(
      roleUser => !roleUser.deleted_at && roleUser.user.id === userId
    )
  )
}
