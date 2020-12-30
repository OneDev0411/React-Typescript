import { isLeaseProperty } from 'utils/listing'
import { numberToUSD } from 'utils/number-to-usd'

export function getPrice(listing: IListing): string {
  const isLease = isLeaseProperty(listing)
  const formattedPrice = numberToUSD(listing.price)

  if (isLease) {
    return `${formattedPrice}/mo`
  }

  return formattedPrice
}
