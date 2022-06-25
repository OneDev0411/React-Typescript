import { useMemo } from 'react'

import { sortBy, uniqBy } from 'lodash'
import { useSelector } from 'react-redux'

import { useQuery } from '@app/hooks/query'
import Deal from '@app/models/Deal'
import { selectActiveTeamUnsafe } from '@app/selectors/team'

import { dealsInitialList } from './keys'

export function useInitialDeals() {
  const activeTeam = useSelector(selectActiveTeamUnsafe)

  const { data, ...rest } = useQuery(
    dealsInitialList(),
    (): Promise<IDeal[]> => Deal.getAll(activeTeam),
    {}
  )

  const list = useMemo(
    () =>
      data
        ? uniqBy(
            sortBy(data, deal => (deal.deal_type === 'Selling' ? 1 : 2)),
            deal => deal.id
          )
        : [],
    [data]
  )

  return {
    data: list,
    ...rest
  }
}
