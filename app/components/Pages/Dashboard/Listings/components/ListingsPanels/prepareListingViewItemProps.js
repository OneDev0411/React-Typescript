import { numberWithCommas } from '../../../../../../utils/helpers'
import listingUtils from '../../../../../../utils/listing'

const listViewItemProps = (user, listing) => {
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
    Math.floor(listingUtils.metersToFeet(property.square_meters))
  )

  let price = listing.price

  if (listing.close_price && user && user.user_type === 'Agent') {
    price = listing.close_price
  }

  const pricePerSquareFoot = Math.floor(
    price / listingUtils.metersToFeet(property.square_meters)
  )

  const backgroundImage = listing.cover_image_url && {
    backgroundImage: `url('${listing.cover_image_url}')`
  }

  const zipCode = address.postal_code
  const builtYear = property.year_built
  const beds = property.bedroom_count || '-'
  const lotSizeArea = property.lot_size_area
  const baths =
    property.half_bathroom_count + property.full_bathroom_count || '-'

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

export default listViewItemProps
