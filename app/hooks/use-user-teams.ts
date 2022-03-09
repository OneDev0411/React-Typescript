import { UseQueryResult } from 'react-query'

import { getTeams } from '@app/models/user/get-teams'

import { useQuery } from './query/use-query'

/**
 * get all user teams
 */

export function useUserTeams(fetchMembers = true): UseQueryResult<IUserTeam[]> {
  return useQuery<IUserTeam[]>(['user-teams', fetchMembers], () =>
    getTeams(fetchMembers)
  )
}
