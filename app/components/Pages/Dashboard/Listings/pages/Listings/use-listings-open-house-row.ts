import { useMemo } from 'react'

import { OpenHouseRow } from './types'
import useListingsOpenHouseRows from './use-listings-open-house-rows'

export type UseListingsOpenHouseRowReturn = Optional<OpenHouseRow>

function useListingsOpenHouseRow(
  listingId: UUID
): UseListingsOpenHouseRowReturn {
  const openHouses = useListingsOpenHouseRows()

  return useMemo(
    () => openHouses.find(openHouse => openHouse.listings.includes(listingId)),
    [listingId, openHouses]
  )
}

export default useListingsOpenHouseRow
