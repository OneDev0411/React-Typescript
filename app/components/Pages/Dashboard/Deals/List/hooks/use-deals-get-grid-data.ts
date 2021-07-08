import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'

import useDealsLoadClosings from './use-deals-load-closings'

interface UseDealsGetGridData {
  isLoading: boolean
  deals: Record<UUID, IDeal>
  roles: Record<UUID, IDealRole>
  isClosingsTab: boolean
}

function useDealsGetGridData(activeFilter: string): UseDealsGetGridData {
  const isFetchingDeals = useSelector(
    ({ deals }: IAppState) => deals.properties.isFetchingDeals
  )
  const deals = useSelector(({ deals }: IAppState) => deals.list)
  const roles = useSelector(({ deals }: IAppState) => deals.roles)

  const isClosingsTab = activeFilter === 'closings'
  const {
    isLoading: isClosingsLoading,
    deals: closingsDeals,
    roles: closingsRoles
  } = useDealsLoadClosings(isClosingsTab)

  return {
    isLoading: isFetchingDeals || isClosingsLoading,
    deals: isClosingsTab ? closingsDeals : deals,
    roles: isClosingsTab ? closingsRoles : roles,
    isClosingsTab
  }
}

export default useDealsGetGridData
