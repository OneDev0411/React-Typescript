import { ITeam } from 'models/BrandConsole/types'

import { getTeamUsers } from './get-team-users'
import { userMatches } from './users-matches'

export function teamMatches(team: ITeam, searchTerm: string) {
  const regExp = new RegExp(searchTerm, 'gi')

  // TODO: improve search UX with fuse
  return (
    team.name.match(regExp) ||
    getTeamUsers(team).some(user => userMatches(user, searchTerm))
  )
}
