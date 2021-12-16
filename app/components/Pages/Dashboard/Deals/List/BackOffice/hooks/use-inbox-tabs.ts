import { useDeepCompareEffect } from 'react-use'

import useAsync from '@app/hooks/use-async'
import Deal from '@app/models/Deal'
import { useUnsafeActiveTeam } from 'hooks/team/use-unsafe-active-team'

import { extractDealsInboxFilters } from '../helpers/get-deals-inbox-filters'

export function useInboxTabs(): Nullable<string>[] {
  const activeTeam = useUnsafeActiveTeam()

  const { data: filters, run } = useAsync<string[]>({ data: [] })

  useDeepCompareEffect(() => {
    run(async () => {
      const deals = await Deal.getAll(activeTeam)

      return extractDealsInboxFilters(deals)
    })
  }, [activeTeam])

  return filters
}
