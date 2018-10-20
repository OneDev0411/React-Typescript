import {
  getStatusColor,
  addressTitle as getAddressTitle,
  metersToFeet
} from '../../../../../utils/listing'

export const formatListing = (listing, user) => {
  const statusColor = getStatusColor(listing.status)
  let property = listing.compact_property
  let address = listing.address

  if (!property) {
    property = listing.property
  }

  if (!address) {
    address = property.address
  }

  const addressTitle = getAddressTitle(address)
  const baths = property.half_bathroom_count + property.full_bathroom_count || 0
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
    address: addressTitle,
    zipCode,
    beds,
    baths,
    sqft,
    pricePerSquareFoot,
    builtYear,
    lotSizeArea
  }
}
