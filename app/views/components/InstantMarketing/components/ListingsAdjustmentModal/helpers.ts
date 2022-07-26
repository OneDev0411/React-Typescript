import { EMPTY_ADJUSTMENT, MIN_ADJUSTMENT_SIZE } from './constants'
import {
  Adjustments,
  IAdjustmentOptionalValue,
  IListingWithAdjustment
} from './types'

export function sumAdjustmentsPrice(
  adjustments: Optional<IAdjustmentOptionalValue[]>
): Optional<number> {
  return adjustments?.reduce(
    (previousValue, currentObject) =>
      (currentObject.value || 0) + previousValue,
    0
  )
}

export function createInitialAdjustments(
  listings: IListingWithAdjustment[]
): Adjustments {
  return listings.reduce((previousValue, currentValue) => {
    return {
      ...previousValue,
      [currentValue.id]: currentValue.adjustments || []
    }
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

export function fillAdjustmentsWithEmptyItems(
  adjustments: IAdjustmentOptionalValue[],
  min = MIN_ADJUSTMENT_SIZE
): IAdjustmentOptionalValue[] {
  const restSize = Math.max(min - adjustments.length, 0)
  const rest: IAdjustmentOptionalValue[] = new Array(restSize).fill(
    EMPTY_ADJUSTMENT
  )

  return [...adjustments, ...rest]
}
