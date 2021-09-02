import {
  getStatusColor,
  addressTitle as getAddressTitle,
  metersToFeet
} from 'utils/listing'

export interface ICompactListingExtras {
  backgroundImage: Nullable<
    | ''
    | {
        backgroundImage: string
      }
  >
  statusColor: string
  addressTitle: string
  zipCode: string
  beds: number
  baths: number
  sqft: number
  pricePerSquareFoot: number
  builtYear: number
  lotSizeArea: Nullable<number>
}

export function formatListing(
  listing: ICompactListing,
  user?: Nullable<IUser>
): ICompactListing & ICompactListingExtras {
  const statusColor = getStatusColor(listing.status)

  const property = listing.compact_property
  const address = listing.address

  const addressTitle = getAddressTitle(address)
  const baths = property.bathroom_count || 0
  const beds = property.bedroom_count || 0
  const builtYear = property.year_built
  const lotSizeArea = property.lot_size_area
  const zipCode = address.postal_code
  const sqft = property.square_meters
    ? Math.floor(metersToFeet(property.square_meters))
    : 0

  let price = listing.price

  if (listing.close_price && user && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const pricePerSquareFoot = price && sqft ? Math.floor(price / sqft) : 0

  const backgroundImage = listing.cover_image_url && {
    backgroundImage: `url('${listing.cover_image_url}')`
  }

  return {
    ...listing,
    backgroundImage,
    statusColor,
    addressTitle,
    zipCode,
    beds,
    baths,
    sqft,
    pricePerSquareFoot,
    builtYear,
    lotSizeArea
  }
}
