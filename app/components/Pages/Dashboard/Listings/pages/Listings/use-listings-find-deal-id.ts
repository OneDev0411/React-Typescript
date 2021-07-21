import { useMemo } from 'react'

import { useSelector } from 'react-redux'

import { selectDealsList } from '@app/selectors/deals'

function useListingsFindDealId(listingId: UUID): Optional<UUID> {
  const deals = useSelector(selectDealsList)

  return useMemo(() => {
    const dealList: IDeal[] = Object.values(deals ?? {})
    const deal = dealList.find(deal => deal.listing === listingId)

    return deal?.id
  }, [deals, listingId])
}

export default useListingsFindDealId
