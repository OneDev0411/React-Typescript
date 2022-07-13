import { Adjustments, IAdjustment, IListingWithAdjustment } from './types'

function sumAdjustmentsPrice(
  adjustments: Optional<IAdjustment[]>
): Optional<number> {
  return adjustments?.reduce(
    (previousValue, currentObject) => currentObject.value + previousValue,
    0
  )
}

export function createInitialAdjustments(listings: IListing[]): Adjustments {
  return listings.reduce((previousValue, currentValue) => {
    return { ...previousValue, [currentValue.id]: [] }
  }, {})
}

export function addAdjustmentToListings(
  listings: IListing[],
  adjustments: Adjustments
): IListingWithAdjustment[] {
  return listings.map(listing => {
    const listingAdjustments = adjustments[listing.id] || undefined
    const listingAdjustmentPrice = sumAdjustmentsPrice(listingAdjustments)

    return {
      ...listing,
      adjustments: listingAdjustments,
      adjusted_price: listingAdjustmentPrice
        ? listing.price + listingAdjustmentPrice
        : undefined
    }
  })
}
