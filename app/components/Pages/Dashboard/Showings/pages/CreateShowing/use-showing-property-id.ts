import { getFullAddressFromSrdAddr } from '../../helpers'
import { ShowingPropertyType } from '../../types'

function useShowingPropertyId(
  property: Nullable<ShowingPropertyType>
): Optional<string> {
  if (property?.type === 'deal') {
    return property.deal.id
  }

  if (property?.type === 'listing') {
    return property.listing.id
  }

  if (property?.type === 'place') {
    return getFullAddressFromSrdAddr(property.address)
  }
}

export default useShowingPropertyId
