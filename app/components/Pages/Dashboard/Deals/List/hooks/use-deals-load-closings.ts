import { normalize } from 'normalizr'
import { useEffect } from 'react'

import { dealsSchema } from '@app/store_actions/deals/schema'

import useDealsGetClosings, {
  UseDealsGetClosings
} from './use-deals-get-closings'

interface UseDealsLoadClosings
  extends Omit<UseDealsGetClosings, 'load' | 'reset' | 'deals'> {
  roles: Record<UUID, IDealRole>
  deals: Record<UUID, IDeal>
}

const defaultDealRoles: Record<UUID, IDealRole> = {}
const defaultDeals: Record<UUID, IDeal> = {}

function useDealsLoadClosings(loadData: boolean): UseDealsLoadClosings {
  const {
    load: loadClosings,
    reset: resetClosings,
    isLoading,
    deals,
    ...other
  } = useDealsGetClosings()

  useEffect(() => {
    if (loadData) {
      loadClosings()
    } else {
      resetClosings()
    }
  }, [loadData, loadClosings, resetClosings])

  const { entities } = normalize(deals, dealsSchema)

  return {
    ...other,
    isLoading: isLoading && loadData,
    deals: entities.deals ?? defaultDeals,
    roles: entities.roles ?? defaultDealRoles
  }
}

export default useDealsLoadClosings
