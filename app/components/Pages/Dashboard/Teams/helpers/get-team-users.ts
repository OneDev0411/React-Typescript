import { flatMap } from 'lodash'

import { ITeam } from 'models/BrandConsole/types'
import { notDeleted } from 'utils/not-deleted'

export function getTeamUsers(team: ITeam): IUser[] {
  return flatMap(
    (team.roles || [])
      .filter(notDeleted)
      .map(role =>
        (role.users || []).filter(notDeleted).map(roleUser => roleUser.user)
      )
  )
}
