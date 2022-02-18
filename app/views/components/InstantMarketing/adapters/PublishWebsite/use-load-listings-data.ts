import { useEffect, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { useActiveBrandId } from '@app/hooks/brand/use-active-brand-id'
import { getMlsDrawerInitialDeals } from 'components/InstantMarketing/helpers/get-mls-drawer-initial-deals'
import useAsync from 'hooks/use-async'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { selectDealsList } from 'selectors/deals'

const defaultList: ICompactListing[] = []

function useLoadListingsData(enable: boolean): [ICompactListing[], any] {
  const activeBrandId = useActiveBrandId()
  const dealsList = useSelector(selectDealsList)

  const { data: brandListings, run } = useAsync({ data: defaultList })

  useEffect(() => {
    if (enable) {
      run(async () => getBrandListings(activeBrandId))
    }
  }, [enable, activeBrandId, run])

  const sortedDealsList = useMemo(
    () => getMlsDrawerInitialDeals(dealsList),
    [dealsList]
  )

  return [brandListings, sortedDealsList]
}

export default useLoadListingsData
