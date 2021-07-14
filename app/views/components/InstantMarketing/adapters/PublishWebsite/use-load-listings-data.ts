import { useEffect, useMemo } from 'react'

import { useSelector } from 'react-redux'

import { getMlsDrawerInitialDeals } from 'components/InstantMarketing/helpers/get-mls-drawer-initial-deals'
import useAsync from 'hooks/use-async'
import { getBrandListings } from 'models/listings/search/get-brand-listings'
import { selectDealsList } from 'selectors/deals'
import { selectActiveTeamId } from 'selectors/team'

const defaultList: ICompactListing[] = []

function useLoadListingsData(enable: boolean): [ICompactListing[], any] {
  const brandId = useSelector(selectActiveTeamId)
  const dealsList = useSelector(selectDealsList)

  const { data: brandListings, run } = useAsync({ data: defaultList })

  useEffect(() => {
    if (enable) {
      run(async () => getBrandListings(brandId))
    }
  }, [enable, brandId, run])

  const sortedDealsList = useMemo(() => getMlsDrawerInitialDeals(dealsList), [
    dealsList
  ])

  return [brandListings, sortedDealsList]
}

export default useLoadListingsData
