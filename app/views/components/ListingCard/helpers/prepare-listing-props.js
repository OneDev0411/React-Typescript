import { numberWithCommas } from '../../../../utils/helpers'
import listingUtils from '../../../../utils/listing'

export const prepareListingProps = (user, listing) => {
  const statusColor = listingUtils.getStatusColor(listing.status)
  let property = listing.compact_property
  let address = listing.address

  if (!property) {
    property = listing.property
  }

  if (!address) {
    address = property.address
  }

  const sqft = numberWithCommas(
    Math.round(listingUtils.metersToFeet(property.square_meters))
  )

  let price = listing.price

  if (listing.close_price && user && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const pricePerSquareFoot =
    price && property.square_meters
      ? Math.floor(price / listingUtils.metersToFeet(property.square_meters))
      : 0

  const backgroundImage = listing.cover_image_url && {
    backgroundImage: `url('${listing.cover_image_url}')`
  }

  const zipCode = address.postal_code
  const builtYear = property.year_built
  const beds = property.bedroom_count || '-'
  const lotSizeArea = property.lot_size_area
  const baths = property.bathroom_count || '-'

  price = numberWithCommas(Math.floor(price))

  if (property && property.property_type === 'Residential Lease') {
    price += '/mo'
  }

  const addressTitle = listingUtils.addressTitle(address)

  return {
    backgroundImage,
    statusColor,
    address: addressTitle,
    zipCode,
    price,
    beds,
    baths,
    sqft,
    pricePerSquareFoot,
    builtYear,
    lotSizeArea
  }
}
