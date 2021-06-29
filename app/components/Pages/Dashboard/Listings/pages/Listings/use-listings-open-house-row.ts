import { OpenHouseRow } from './types'
import useListingsOpenHouseRows from './use-listings-open-house-rows'

type UseListingsOpenHouseRowReturn = Optional<OpenHouseRow>

function useListingsOpenHouseRow(
  listingId: UUID
): UseListingsOpenHouseRowReturn {
  const openHouses = useListingsOpenHouseRows()

  // TODO: there is a problem here in finding the open house by Id

  return openHouses.find(openHouse => openHouse.listings.includes(listingId))
}

export default useListingsOpenHouseRow
