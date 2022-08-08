import { UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'

import { useQuery } from '@app/hooks/query'
import { searchDeals } from '@app/models/Deal/deal'
import { selectActiveTeamUnsafe } from '@app/selectors/team'

import { dealsList } from './keys'

export function useDealsList(criteria: string): UseQueryResult<IDeal[]> {
  const activeTeam = useSelector(selectActiveTeamUnsafe)

  return useQuery(
    dealsList(criteria),
    (): Promise<IDeal[]> => searchDeals(activeTeam, criteria),
    {
      enabled: criteria.trim().length >= 3
    }
  )
}
