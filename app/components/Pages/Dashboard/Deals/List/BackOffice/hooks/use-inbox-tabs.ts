import { useSelector } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import useAsync from '@app/hooks/use-async'
import Deal from '@app/models/Deal'
import { selectUser } from '@app/selectors/user'

import { extractDealsInboxFilters } from '../helpers/get-deals-inbox-filters'

export function useInboxTabs(): Nullable<string>[] {
  const user = useSelector(selectUser)

  const { data: filters, run } = useAsync<string[]>({ data: [] })

  useDeepCompareEffect(() => {
    run(async () => {
      const deals = await Deal.getAll(user)

      return extractDealsInboxFilters(deals)
    })
  }, [user])

  return filters
}
