import { useSelector } from 'react-redux'

import { useMemo } from 'react'

import { useBrandListings, useDealsListings } from '@app/hooks/use-listings'
import { selectActiveBrandId } from '@app/selectors/brand'

import { ListingRow, ListingTabType } from '../../types'

const defaultRows: ListingRow[] = []

interface UseGetListingsListRowsReturn {
  isLoading: boolean
  rows: ListingRow[]
}

function useGetListingsListRows(
  type: ListingTabType // TODO: implement the loading logic using this parameter
): UseGetListingsListRowsReturn {
  const brand = useSelector(selectActiveBrandId)

  const brandListings = useBrandListings(brand)
  const brandListingsIds = useMemo(
    () => brandListings?.map(listing => listing.id),
    [brandListings]
  )
  const dealsListings = useDealsListings(brandListingsIds)

  const rows =
    brandListings && dealsListings
      ? [...dealsListings, ...brandListings]
      : defaultRows

  return {
    isLoading: !!brandListings && !!dealsListings,
    rows
  }
}

export default useGetListingsListRows
