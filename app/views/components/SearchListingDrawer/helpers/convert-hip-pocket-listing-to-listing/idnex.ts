import addressParser from 'parse-address'

import { HipPocketListing } from 'components/HipPocketListing'

import { feetToMeters } from 'utils/listing'

function getPropertyAddress(address?: string): Partial<Address> {
  if (!address) {
    return {
      street_number: '',
      street_name: '',
      street_address: '',
      city: '',
      state: '',
      postal_code: '',
      full_address: ''
    }
  }

  const parsed = addressParser.parseLocation(address)

  const streetAddressParts = [
    parsed.number,
    parsed.prefix,
    parsed.street,
    parsed.type,
    parsed.city,
    parsed.sec_unit_type,
    parsed.sec_unit_num
  ].filter(item => !!item)

  const fullAddressParts = [
    ...streetAddressParts,
    parsed.city,
    parsed.state,
    parsed.zip
  ].filter(item => !!item)

  return {
    street_number: parsed.number,
    street_name: parsed.street,
    street_address: streetAddressParts.join(' '),
    city: parsed.city,
    state: parsed.state,
    postal_code: parsed.zip,
    full_address: fullAddressParts.join(' ')
  }
}

export function convertHipPokcetListingToListing(
  hipPocketListing: Partial<HipPocketListing>
): DeepPartial<IListing> {
  return {
    type: 'listing',
    gallery_image_urls: hipPocketListing.images ?? [],
    url: hipPocketListing.url ?? '',
    price: hipPocketListing.price ?? 0,
    property: {
      bedroom_count: hipPocketListing.bedrooms ?? 0,
      full_bathroom_count: hipPocketListing.full_baths ?? 0,
      half_bathroom_count: hipPocketListing.half_baths ?? 0,
      square_meters: feetToMeters(hipPocketListing.sqft ?? 0),
      description: hipPocketListing.description ?? '',
      address: getPropertyAddress(hipPocketListing.address)
    }
  }
}
